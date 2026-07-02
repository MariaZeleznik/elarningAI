'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle, ChevronLeft, ChevronRight, BookOpen, Clock, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CodeExercise } from '@/components/course/code-exercise';
import type { LessonWithContent, LessonMeta, CourseMeta, Exercise } from '@/lib/courses';

interface Props {
  lesson: LessonWithContent;
  course: CourseMeta;
  allLessons: LessonMeta[];
  nextLesson: LessonMeta | null;
  prevLesson: LessonMeta | null;
  userId: string | null;
  exercise?: Exercise;
  children: React.ReactNode;
}

export function LessonPlayer({ lesson, course, allLessons, nextLesson, prevLesson, userId, exercise, children }: Props) {
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  async function markComplete() {
    if (!userId) {
      router.push(`/logowanie?callbackUrl=/kursy/${course.slug}/${lesson.slug}`);
      return;
    }
    setSaving(true);
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug: course.slug, lessonSlug: lesson.slug }),
      });
      setCompleted(true);
      toast.success('Lekcja ukończona!');
    } catch {
      toast.error('Nie udało się zapisać postępu');
    } finally {
      setSaving(false);
    }
  }

  const currentIdx = allLessons.findIndex((l) => l.slug === lesson.slug);
  const progress = ((currentIdx + 1) / allLessons.length) * 100;

  return (
    <div className="min-h-screen bg-brand-gray">
      {/* Progress bar sticky top */}
      <div className="sticky top-0 z-30 bg-brand-navy h-1">
        <div
          className="h-full bg-brand-teal transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Mobile: program kursu drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-heading font-semibold text-brand-navy">Program kursu</h3>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-brand-muted hover:text-brand-navy">
                <X size={20} />
              </button>
            </div>
            <ol className="p-3 space-y-1">
              {allLessons.map((l, idx) => (
                <li key={l.slug}>
                  <Link
                    href={`/kursy/${course.slug}/${l.slug}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      l.slug === lesson.slug
                        ? 'bg-brand-teal/10 text-brand-teal font-semibold'
                        : 'text-brand-dark hover:bg-gray-50'
                    }`}
                  >
                    <span className="w-6 text-center font-bold shrink-0 text-xs">{idx + 1}</span>
                    <span className="flex-1">{l.title}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 py-4 md:py-6">
        {/* Breadcrumb + mobile sidebar toggle */}
        <div className="flex items-center justify-between mb-4">
          <nav aria-label="Breadcrumb" className="text-sm text-brand-muted flex items-center gap-1.5 min-w-0">
            <Link href="/kursy" className="hover:text-brand-teal transition-colors shrink-0">Kursy</Link>
            <span className="shrink-0">/</span>
            <Link href={`/kursy/${course.slug}`} className="hover:text-brand-teal transition-colors truncate hidden sm:block">{course.title}</Link>
            <span className="shrink-0 hidden sm:block">/</span>
            <span className="text-brand-dark font-medium truncate">{lesson.title}</span>
          </nav>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-1.5 text-xs font-medium text-brand-navy bg-white border border-gray-200 px-3 py-1.5 rounded-lg shrink-0 ml-2"
          >
            <Menu size={14} /> Program
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Lesson content */}
          <article className="lg:col-span-3 min-w-0">
            <header className="mb-5">
              <div className="flex items-center gap-3 text-xs text-brand-muted mb-2 flex-wrap">
                <span className="flex items-center gap-1"><BookOpen size={13} /> Moduł {lesson.module}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock size={13} /> {lesson.duration} min</span>
                {lesson.free && <span className="text-brand-teal font-medium">Lekcja darmowa</span>}
              </div>
              <h1 className="font-heading font-bold text-xl md:text-2xl lg:text-3xl text-brand-navy leading-tight">{lesson.title}</h1>
            </header>

            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm break-words [&_pre]:overflow-x-auto [&_pre]:text-sm [&_table]:block [&_table]:overflow-x-auto [&_table]:max-w-full [&_img]:max-w-full [&_img]:h-auto">
              {children}
            </div>

            {exercise && (
              <div className="mt-5">
                <CodeExercise
                  prompt={exercise.prompt}
                  expected={exercise.expected}
                  hint={exercise.hint}
                  language={exercise.language}
                />
              </div>
            )}

            {/* Mark complete + navigation */}
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {userId ? (
                <Button
                  onClick={markComplete}
                  loading={saving}
                  disabled={completed}
                  variant={completed ? 'ghost' : 'primary'}
                  className={completed ? 'text-green-600' : ''}
                >
                  {completed ? <><CheckCircle size={16} className="mr-1.5" />Ukończona</> : 'Oznacz jako ukończoną'}
                </Button>
              ) : (
                <Link
                  href={`/logowanie?callbackUrl=/kursy/${course.slug}/${lesson.slug}`}
                  className="inline-flex items-center gap-2 bg-brand-navy hover:bg-blue-900 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
                >
                  Zaloguj się, by zapisać postęp
                </Link>
              )}

              <div className="flex gap-3 self-end sm:self-auto">
                {prevLesson && (
                  <Link
                    href={`/kursy/${course.slug}/${prevLesson.slug}`}
                    className="flex items-center gap-1 text-sm text-brand-muted hover:text-brand-navy transition-colors"
                  >
                    <ChevronLeft size={16} /> Poprzednia
                  </Link>
                )}
                {nextLesson && (
                  <Link
                    href={`/kursy/${course.slug}/${nextLesson.slug}`}
                    className="flex items-center gap-1 text-sm font-medium bg-brand-navy hover:bg-blue-900 text-white px-4 py-2 rounded-xl transition-colors"
                  >
                    Następna <ChevronRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          </article>

          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-16">
              <h3 className="font-heading font-semibold text-sm text-brand-navy mb-3">Program kursu</h3>
              <ol className="space-y-1">
                {allLessons.map((l, idx) => (
                  <li key={l.slug}>
                    <Link
                      href={`/kursy/${course.slug}/${l.slug}`}
                      className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors ${
                        l.slug === lesson.slug
                          ? 'bg-brand-teal/10 text-brand-teal font-semibold'
                          : l.free
                          ? 'text-brand-dark hover:bg-gray-50'
                          : 'text-brand-muted hover:bg-gray-50'
                      }`}
                    >
                      <span className="w-5 text-center font-bold shrink-0">{idx + 1}</span>
                      <span className="truncate">{l.title}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
