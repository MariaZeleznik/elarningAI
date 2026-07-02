import type { Metadata } from 'next';
import Image from 'next/image';
import { getAllCourses, getCourseLessons } from '@/lib/courses';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Neurova AI Academy — Kursy AI i Analityki Danych po Polsku',
  description:
    'Darmowe kursy AI i analityki danych po polsku. Certyfikat potwierdzony egzaminem. Zacznij dziś na Neurova AI Academy.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Neurova AI Academy — Kursy AI i Analityki Danych po Polsku',
    description: 'Darmowe kursy AI i analityki danych po polsku. Certyfikat potwierdzony egzaminem.',
    images: [{ url: '/og-image.svg', width: 1200, height: 630 }],
  },
};

const faqs = [
  {
    q: 'Czy kursy są naprawdę darmowe?',
    a: 'Tak - wszystkie materiały edukacyjne są bezpłatne. Płacisz tylko za egzamin certyfikacyjny (249 lub 349 PLN), gdy jesteś gotowy/gotowa.',
  },
  {
    q: 'Co to jest certyfikat Neurova?',
    a: 'Certyfikat PDF z unikalnym UUID weryfikowanym publicznie. Zawiera link do LinkedIn - dodasz go do profilu jednym kliknięciem.',
  },
  {
    q: 'Czy potrzebuję wcześniejszego doświadczenia?',
    a: 'Nie. Kursy zaczynają się od podstaw i prowadzą krok po kroku do poziomu zawodowego.',
  },
];

const courseColors: Record<string, string> = {
  'analityka-danych': 'border-brand-teal',
  'ai-machine-learning': 'border-brand-gold',
};

export default function HomePage() {
  const courses = getAllCourses();

  // Compute unique module count dynamically from lesson files
  const moduleCountByCourse = courses.map((course) => {
    const lessons = getCourseLessons(course.slug);
    const uniqueModules = new Set(lessons.map((l) => l.module)).size;
    return { ...course, actualModules: uniqueModules };
  });
  const totalModules = moduleCountByCourse.reduce((sum, c) => sum + c.actualModules, 0);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Neurova AI Academy',
    url: 'https://neurova.pl',
    description:
      'Polska platforma edukacyjna z kursami AI i analityki danych oraz certyfikatami potwierdzonymi egzaminem.',
    inLanguage: 'pl',
    logo: 'https://neurova.pl/og-image.svg',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* Hero */}
        <section className="bg-brand-navy text-white py-14 md:py-20 overflow-hidden">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* Text */}
              <div className="text-center lg:text-left">
                <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl leading-tight mb-5">
                  Zdobądź Certyfikat AI lub Analityki Danych{' '}
                  <span className="text-brand-gold">- Nauka po Polsku</span>
                </h1>
                <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 mb-8">
                  Darmowe kursy. Certyfikat potwierdzony egzaminem. LinkedIn-ready. Bez poprzedniego doświadczenia.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a
                    href="/kursy"
                    className="bg-brand-teal hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-xl text-lg touch-target flex items-center justify-center transition-colors"
                  >
                    Zacznij naukę za darmo →
                  </a>
                  <a
                    href="/kursy"
                    className="border border-white/30 hover:border-brand-gold text-white font-semibold px-8 py-4 rounded-xl text-lg touch-target flex items-center justify-center transition-colors"
                  >
                    Zobacz kursy
                  </a>
                </div>
              </div>

              {/* Hero illustration */}
              <div className="hidden lg:flex items-center justify-center">
                <Image
                  src="/images/hero.svg"
                  alt="Nauka AI i analityki danych - interaktywne kursy Neurova AI Academy"
                  width={520}
                  height={420}
                  className="w-full max-w-md drop-shadow-2xl"
                  priority
                />
              </div>
              {/* Mobile: smaller illustration below text */}
              <div className="flex lg:hidden items-center justify-center -mt-4">
                <Image
                  src="/images/hero.svg"
                  alt="Kursy AI i analityki danych po polsku"
                  width={400}
                  height={320}
                  className="w-full max-w-xs opacity-80"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white border-b border-gray-100" aria-label="Statystyki platformy">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <ul className="grid grid-cols-3 gap-4 text-center list-none" role="list">
              <li>
                <p className="font-heading font-bold text-3xl md:text-4xl text-brand-navy">{courses.length}</p>
                <p className="text-sm md:text-base text-brand-muted mt-1">Kursy certyfikacyjne</p>
              </li>
              <li>
                <p className="font-heading font-bold text-3xl md:text-4xl text-brand-navy">{totalModules}</p>
                <p className="text-sm md:text-base text-brand-muted mt-1">Modułów łącznie</p>
              </li>
              <li>
                <p className="font-heading font-bold text-3xl md:text-4xl text-brand-navy">100%</p>
                <p className="text-sm md:text-base text-brand-muted mt-1">Po polsku</p>
              </li>
            </ul>
          </div>
        </section>

        {/* Kursy */}
        <section className="py-14 md:py-20" aria-labelledby="kursy-heading">
          <div className="mx-auto max-w-6xl px-4">
            <h2 id="kursy-heading" className="font-heading font-bold text-2xl md:text-3xl text-brand-navy text-center mb-10">
              Wybierz swoją ścieżkę
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {moduleCountByCourse.map((course) => (
                <article
                  key={course.slug}
                  className={`bg-white rounded-2xl p-6 md:p-8 shadow-sm border-t-4 ${courseColors[course.slug] ?? 'border-brand-navy'} hover:shadow-md transition-shadow`}
                >
                  <h3 className="font-heading font-bold text-xl text-brand-navy mb-3">{course.title}</h3>
                  <p className="text-brand-muted mb-6 text-sm md:text-base">{course.description}</p>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <span className="text-sm text-brand-muted">{course.actualModules} modułów</span>
                      <span className="mx-2 text-gray-300">·</span>
                      <span className="text-sm text-brand-muted">Egzamin: {formatPrice(course.priceGrosze)}</span>
                    </div>
                    <a
                      href={`/kursy/${course.slug}`}
                      className="bg-brand-navy hover:bg-blue-900 text-white font-semibold px-5 py-2.5 rounded-lg touch-target flex items-center transition-colors text-sm"
                    >
                      Zacznij →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-14 md:py-16" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-3xl px-4">
            <h2 id="faq-heading" className="font-heading font-bold text-2xl md:text-3xl text-brand-navy text-center mb-10">
              Często zadawane pytania
            </h2>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: faqs.map((faq) => ({
                    '@type': 'Question',
                    name: faq.q,
                    acceptedAnswer: { '@type': 'Answer', text: faq.a },
                  })),
                }),
              }}
            />
            <dl className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.q} className="border border-gray-100 rounded-xl p-5 md:p-6">
                  <dt className="font-heading font-semibold text-brand-navy mb-2">{faq.q}</dt>
                  <dd className="text-brand-muted">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* CTA końcowe */}
        <section className="bg-brand-navy text-white py-14 text-center" aria-labelledby="cta-heading">
          <div className="mx-auto max-w-2xl px-4">
            <h2 id="cta-heading" className="font-heading font-bold text-2xl md:text-3xl mb-4">
              Gotowy/Gotowa na start?
            </h2>
            <p className="text-gray-300 mb-8">
              Pierwsze lekcje bez rejestracji. Konto tworzysz gdy jesteś gotowy/gotowa.
            </p>
            <a
              href="/kursy"
              className="inline-flex items-center bg-brand-gold hover:bg-amber-600 text-brand-navy font-bold px-8 py-4 rounded-xl text-lg touch-target transition-colors"
            >
              Przeglądaj kursy →
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
