import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllCourses } from '@/lib/courses';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Kursy AI i Analityki Danych',
  description: 'Darmowe kursy AI i analityki danych po polsku. Certyfikat potwierdzony egzaminem.',
};

export default function CoursesPage() {
  const courses = getAllCourses();
  const colors: Record<string, string> = {
    'analityka-danych': 'border-brand-teal',
    'ai-machine-learning': 'border-brand-gold',
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-navy mb-4">
          Kursy certyfikacyjne
        </h1>
        <p className="text-lg text-brand-muted max-w-xl mx-auto">
          Materiały darmowe. Płacisz tylko za egzamin — gdy jesteś gotowy/gotowa.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {courses.map((course) => (
          <article key={course.slug} className={`bg-white rounded-2xl shadow-sm border-t-4 ${colors[course.slug] ?? 'border-brand-teal'} p-5 md:p-8 hover:shadow-md transition-shadow`}>
            <h2 className="font-heading font-bold text-2xl text-brand-navy mb-3">{course.title}</h2>
            <p className="text-brand-muted mb-6">{course.description}</p>

            <div className="flex items-center gap-4 text-sm text-brand-muted mb-6">
              <span>📚 {course.modules} modułów</span>
              <span>·</span>
              <span>🏆 Certyfikat: {formatPrice(course.priceGrosze)}</span>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/kursy/${course.slug}`}
                className="flex-1 bg-brand-navy hover:bg-blue-900 text-white font-semibold px-5 py-3 rounded-xl text-center transition-colors"
              >
                Zacznij kurs →
              </Link>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-16 bg-white rounded-2xl p-8 text-center">
        <h2 className="font-heading font-bold text-xl text-brand-navy mb-3">Jak to działa?</h2>
        <div className="grid md:grid-cols-3 gap-6 text-sm text-brand-muted mt-6">
          {[
            { step: '1', text: 'Przeglądasz materiały za darmo — pierwsze 2 lekcje bez rejestracji' },
            { step: '2', text: 'Rejestrujesz się emailem i uczysz we własnym tempie' },
            { step: '3', text: 'Kupujesz egzamin (jednorazowo) i zdobywasz certyfikat' },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-brand-teal text-white font-bold flex items-center justify-center">{item.step}</div>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
