import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCourse, getLesson, getCourseLessons } from '@/lib/courses';
import { renderMarkdown } from '@/lib/render-markdown';
import { LessonPlayer } from '@/components/course/lesson-player';

interface Props { params: { slug: string; lesson: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lesson = getLesson(params.slug, params.lesson);
  const course = getCourse(params.slug);
  if (!lesson || !course) return {};
  return {
    title: `${lesson.title} — ${course.title}`,
    robots: { index: false },
  };
}

export default async function LessonPage({ params }: Props) {
  const lesson = getLesson(params.slug, params.lesson);
  if (!lesson) notFound();

  const course = getCourse(params.slug);
  if (!course) notFound();

  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch {
    // getServerSession failed — treat as unauthenticated
  }

  if (!lesson.free && !session) {
    redirect(`/logowanie?callbackUrl=/kursy/${params.slug}/${params.lesson}`);
  }

  const allLessons = getCourseLessons(params.slug);
  const currentIdx = allLessons.findIndex((l) => l.slug === params.lesson);
  const nextLesson = allLessons[currentIdx + 1] ?? null;
  const prevLesson = allLessons[currentIdx - 1] ?? null;

  const content = await renderMarkdown(lesson.content);

  return (
    <LessonPlayer
      lesson={lesson}
      course={course}
      allLessons={allLessons}
      nextLesson={nextLesson}
      prevLesson={prevLesson}
      userId={session?.user?.id ?? null}
      exercise={lesson.exercise}
    >
      {content}
    </LessonPlayer>
  );
}
