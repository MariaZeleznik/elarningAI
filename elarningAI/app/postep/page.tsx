import type { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getCourse, getCourseLessons } from '@/lib/courses';

export const metadata: Metadata = {
  title: 'Mój postęp — Neurova AI Academy',
  robots: { index: false },
};

export default async function PostepPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/logowanie?callbackUrl=/postep');

  const dbCourses = await prisma.course.findMany({
    select: { id: true, slug: true, title: true },
  });

  const progressRows = await prisma.userProgress.findMany({
    where: { userId: session.user.id },
    select: { courseId: true, lessonSlug: true, completed: true, completedAt: true },
  });

  const progressByCourse: Record<string, Set<string>> = {};
  for (const row of progressRows) {
    if (!progressByCourse[row.courseId]) progressByCourse[row.courseId] = new Set();
    if (row.completed) progressByCourse[row.courseId].add(row.lessonSlug);
  }

  const courseStats = dbCourses.map((course) => {
    const allLessons = getCourseLessons(course.slug);
    const totalLessons = allLessons.length;
    const completedLessons = progressByCourse[course.id]?.size ?? 0;
    const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    return { ...course, totalLessons, completedLessons, pct };
  });

  const certificates = await prisma.certificate.findMany({
    where: { userId: session.user.id },
    select: { id: true, courseId: true, issuedAt: true },
  });
  const certByCourse = new Map(certificates.map((c) => [c.courseId, c]));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="font-heading font-bold text-2xl text-brand-navy">Mój postęp</h1>
        <p className="text-brand-muted mt-1">Śledź swoje postępy w kursach</p>
      </header>

      {courseStats.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-brand-muted text-lg mb-4">Nie ma jeszcze żadnych kursów.</p>
          <Link href="/kursy" className="text-brand-teal hover:underline font-medium">Przeglądaj kursy →</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {courseStats.map((course) => {
            const cert = certByCourse.get(course.id);
            return (
              <div key={course.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="font-heading font-bold text-lg text-brand-navy">{course.title}</h2>
                    <p className="text-sm text-brand-muted mt-0.5">
                      {course.completedLessons} / {course.totalLessons} lekcji ukończono
                    </p>
                  </div>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full shrink-0 ${
                    course.pct === 100 ? 'bg-green-100 text-green-700' : 'bg-brand-teal/10 text-brand-teal'
                  }`}>
                    {course.pct}%
                  </span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                  <div
                    className={`h-2 rounded-full transition-all ${course.pct === 100 ? 'bg-green-500' : 'bg-brand-teal'}`}
                    style={{ width: `${course.pct}%` }}
                  />
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <Link
                    href={`/kursy/${course.slug}`}
                    className="text-sm font-semibold text-brand-teal hover:underline"
                  >
                    {course.pct === 0 ? 'Zacznij kurs →' : course.pct === 100 ? 'Przeglądaj kurs →' : 'Kontynuuj kurs →'}
                  </Link>
                  {cert ? (
                    <Link
                      href={`/certyfikat/${cert.id}`}
                      className="text-sm bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
                    >
                      Certyfikat ✓
                    </Link>
                  ) : course.pct === 100 ? (
                    <Link
                      href={`/egzamin/${course.slug}/platnosc`}
                      className="text-sm bg-brand-navy text-white font-semibold px-3 py-1 rounded-full hover:bg-brand-navy/90 transition-colors"
                    >
                      Zdaj egzamin →
                    </Link>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link href="/certyfikaty" className="text-sm text-brand-muted hover:text-brand-teal transition-colors">
          Moje certyfikaty →
        </Link>
      </div>
    </div>
  );
}
