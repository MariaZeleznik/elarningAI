import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getAllCourses, getCourseLessons } from '@/lib/courses';
import { formatPrice, formatDate } from '@/lib/utils';
import { DevTools } from './dev-tools';

export const metadata = { title: 'Mój panel', robots: { index: false } };

export default async function DashboardPage() {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch {
    // getServerSession failed
  }
  if (!session) redirect('/logowanie');

  const [userProgress, certificates, payments] = await Promise.all([
    prisma.userProgress.findMany({ where: { userId: session.user.id, completed: true }, include: { course: true } }),
    prisma.certificate.findMany({ where: { userId: session.user.id }, include: { course: true }, orderBy: { issuedAt: 'desc' } }),
    prisma.payment.findMany({ where: { userId: session.user.id, status: 'SUCCESS' }, include: { course: true } }),
  ]);

  const courses = getAllCourses();
  const paidCourseIds = new Set(payments.map((p) => p.course.slug));

  const courseStats = courses.map((course) => {
    const lessons = getCourseLessons(course.slug);
    const completedSlugs = new Set(userProgress.filter((p) => p.course.slug === course.slug).map((p) => p.lessonSlug));
    const percent = lessons.length > 0 ? Math.round((completedSlugs.size / lessons.length) * 100) : 0;
    const cert = certificates.find((c) => c.course.slug === course.slug);
    return { course, lessons, completedCount: completedSlugs.size, percent, hasPaid: paidCourseIds.has(course.slug), certificate: cert ?? null };
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="font-heading font-bold text-2xl text-brand-navy">Cześć, {session.user.name?.split(' ')[0] ?? 'uczniu'} 👋</h1>
        <p className="text-brand-muted mt-1">Twój postęp nauki na Neurova AI Academy</p>
      </header>

      {/* Course progress cards */}
      <section aria-labelledby="kursy-h2" className="mb-10">
        <h2 id="kursy-h2" className="font-heading font-semibold text-lg text-brand-navy mb-4">Twoje kursy</h2>
        {courseStats.every((s) => s.completedCount === 0) ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <p className="text-brand-muted mb-4">Nie zacząłeś/zaczęłaś jeszcze żadnego kursu.</p>
            <Link href="/kursy" className="bg-brand-teal hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl inline-block transition-colors">
              Przeglądaj kursy →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {courseStats.map(({ course, lessons, completedCount, percent, hasPaid, certificate }) => (
              <div key={course.slug} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-heading font-bold text-brand-navy mb-3">{course.title}</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="bg-brand-teal h-2 rounded-full transition-all" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="text-sm font-medium text-brand-navy w-10 text-right">{percent}%</span>
                </div>
                <p className="text-sm text-brand-muted mb-4">{completedCount} / {lessons.length} lekcji ukończonych</p>

                {certificate ? (
                  <Link href={`/certyfikat/${certificate.id}`} className="block w-full text-center bg-brand-gold hover:bg-amber-600 text-brand-navy font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
                    🏆 Zobacz certyfikat
                  </Link>
                ) : percent === 100 && !hasPaid ? (
                  <Link href={`/egzamin/${course.slug}/platnosc`} className="block w-full text-center bg-brand-teal hover:bg-teal-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
                    Kup egzamin — {formatPrice(course.priceGrosze)} →
                  </Link>
                ) : percent === 100 && hasPaid ? (
                  <Link href={`/egzamin/${course.slug}`} className="block w-full text-center bg-brand-navy hover:bg-blue-900 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
                    Przystąp do egzaminu →
                  </Link>
                ) : (
                  <Link href={`/kursy/${course.slug}`} className="block w-full text-center border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
                    Kontynuuj →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Certificates */}
      {certificates.length > 0 && (
        <section aria-labelledby="cert-h2">
          <h2 id="cert-h2" className="font-heading font-semibold text-lg text-brand-navy mb-4">Twoje certyfikaty</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <Link key={cert.id} href={`/certyfikat/${cert.id}`} className="bg-white rounded-2xl p-5 border border-brand-gold/30 hover:shadow-md transition-shadow flex items-center gap-4">
                <div className="text-3xl">🏆</div>
                <div>
                  <p className="font-semibold text-brand-navy">{cert.course.title}</p>
                  <p className="text-sm text-brand-muted">{formatDate(cert.issuedAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Dev tools — only visible in dev mode */}
      {process.env.EMAIL_PROVIDER === 'console' && (
        <DevTools courses={courseStats.map(s => ({ slug: s.course.slug, title: s.course.title }))} />
      )}
    </div>
  );
}
