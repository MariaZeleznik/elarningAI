import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Lock, PlayCircle, Clock } from 'lucide-react';
import { getCourse, getCourseLessons } from '@/lib/courses';
import { formatPrice, formatLekcje } from '@/lib/utils';

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = getCourse(params.slug);
  if (!course) return {};
  return {
    title: `Kurs ${course.title} — Neurova AI Academy`,
    description: course.description,
    alternates: { canonical: `/kursy/${course.slug}` },
    openGraph: {
      title: `Kurs ${course.title}`,
      description: course.description,
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return [{ slug: 'analityka-danych' }, { slug: 'ai-machine-learning' }];
}

export default function CourseDetailPage({ params }: Props) {
  const course = getCourse(params.slug);
  if (!course) notFound();

  const lessons = getCourseLessons(params.slug);
  const freeLessons = lessons.filter((l) => l.free);

  // Group lessons by module number
  const lessonsByModule = lessons.reduce<Record<number, typeof lessons>>((acc, lesson) => {
    if (!acc[lesson.module]) acc[lesson.module] = [];
    acc[lesson.module].push(lesson);
    return acc;
  }, {});
  const uniqueModuleNumbers = Object.keys(lessonsByModule)
    .map(Number)
    .sort((a, b) => a - b);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: { '@type': 'Organization', name: 'Neurova AI Academy', sameAs: 'https://neurova.pl' },
    inLanguage: 'pl',
    numberOfCredits: uniqueModuleNumbers.length,
    offers: {
      '@type': 'Offer',
      price: course.priceGrosze / 100,
      priceCurrency: 'PLN',
      description: 'Egzamin certyfikacyjny',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div className="bg-brand-navy text-white py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400 mb-4">
            <Link href="/kursy" className="hover:text-white transition-colors">Kursy</Link>
            {' / '}
            <span>{course.title}</span>
          </nav>
          <h1 className="font-heading font-bold text-2xl md:text-3xl lg:text-4xl mb-3 leading-tight">{course.title}</h1>
          <p className="text-gray-300 text-base md:text-lg mb-5 max-w-2xl">{course.description}</p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 text-xs mb-6">
            <span className="bg-white/10 px-3 py-1.5 rounded-full">📚 {uniqueModuleNumbers.length} modułów</span>
            <span className="bg-white/10 px-3 py-1.5 rounded-full">🆓 {formatLekcje(freeLessons.length)} za darmo</span>
            <span className="bg-brand-gold/20 border border-brand-gold/30 text-brand-gold px-3 py-1.5 rounded-full">🏆 Egzamin: {formatPrice(course.priceGrosze)}</span>
          </div>

          {/* CTA hero — widoczne od razu, mobile-first */}
          {lessons[0] && (
            <Link
              href={`/kursy/${params.slug}/${lessons[0].slug}`}
              className="inline-flex items-center gap-2 bg-brand-teal hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl text-base transition-colors"
            >
              <PlayCircle size={18} />
              Zacznij za darmo
            </Link>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Lista lekcji pogrupowana wg modułów */}
          <div className="lg:col-span-2 min-w-0">
            <h2 className="font-heading font-bold text-lg md:text-xl text-brand-navy mb-5">Program kursu</h2>
            <div className="space-y-4">
              {uniqueModuleNumbers.map((moduleNum) => {
                const moduleLessons = lessonsByModule[moduleNum];
                return (
                  <div key={moduleNum} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                    {/* Module header */}
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-7 h-7 rounded-full bg-brand-navy text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {moduleNum}
                        </span>
                        <span className="font-semibold text-sm text-brand-navy">Moduł {moduleNum}</span>
                      </div>
                      <span className="text-xs text-brand-muted shrink-0">
                        {formatLekcje(moduleLessons.length)}
                      </span>
                    </div>
                    {/* Lessons in module */}
                    <ol className="divide-y divide-gray-50">
                      {moduleLessons.map((lesson) => (
                        <li key={lesson.slug}>
                          <Link
                            href={`/kursy/${params.slug}/${lesson.slug}`}
                            className={`group flex items-center gap-3 px-4 py-3 transition-colors ${
                              lesson.free
                                ? 'hover:bg-brand-teal/5 cursor-pointer'
                                : 'hover:bg-gray-50 cursor-pointer'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium break-words leading-snug ${lesson.free ? 'text-brand-dark' : 'text-brand-muted'}`}>
                                {lesson.title}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <Clock size={11} className="text-brand-muted shrink-0" />
                                <span className="text-xs text-brand-muted">{lesson.duration} min</span>
                              </div>
                            </div>
                            {lesson.free ? (
                              <div className="flex items-center gap-1 shrink-0">
                                <PlayCircle size={14} className="text-brand-teal" />
                                <span className="text-xs text-brand-teal font-medium hidden sm:block">Darmowa</span>
                              </div>
                            ) : (
                              <Lock size={13} className="text-gray-300 group-hover:text-gray-400 shrink-0 transition-colors" />
                            )}
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar — stały na desktop, pod listą na mobile */}
          <div className="space-y-4">
            <div id="egzamin" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 lg:sticky lg:top-20">
              <div className="text-center mb-5">
                <p className="text-xs text-brand-muted mb-1">Egzamin certyfikacyjny</p>
                <p className="font-heading font-bold text-3xl text-brand-navy">{formatPrice(course.priceGrosze)}</p>
                <p className="text-xs text-brand-muted">jednorazowo za podejście</p>
              </div>
              {lessons[0] && (
                <Link
                  href={`/kursy/${params.slug}/${lessons[0].slug}`}
                  className="block w-full bg-brand-teal hover:bg-teal-700 text-white font-bold px-5 py-3 rounded-xl text-center transition-colors text-sm"
                >
                  Zacznij za darmo →
                </Link>
              )}
              <ul className="mt-4 space-y-2 text-xs text-brand-muted">
                <li className="flex items-center gap-2">✓ Darmowy dostęp do materiałów</li>
                <li className="flex items-center gap-2">✓ {uniqueModuleNumbers.length} modułów po polsku</li>
                <li className="flex items-center gap-2">✓ Certyfikat gotowy na LinkedIn</li>
                <li className="flex items-center gap-2">✓ Publiczna strona weryfikacji</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
