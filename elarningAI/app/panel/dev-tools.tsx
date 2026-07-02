'use client';
import { useState } from 'react';
import { toast } from 'sonner';

interface Course {
  slug: string;
  title: string;
}

export function DevTools({ courses }: { courses: Course[] }) {
  const [loading, setLoading] = useState<string | null>(null);

  async function mockPayment(courseSlug: string) {
    setLoading(courseSlug);
    try {
      const res = await fetch('/api/dev/mock-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(`Błąd: ${data.error}`);
        return;
      }
      toast.success('Płatność zarejestrowana! Przechodzę do egzaminu...');
      await new Promise(r => setTimeout(r, 800));
      window.location.href = `/egzamin/${courseSlug}`;
    } catch {
      toast.error('Błąd połączenia');
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="mt-10 p-5 bg-amber-50 border border-amber-200 rounded-2xl">
      <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-3">🔧 Narzędzia deweloperskie</p>
      <p className="text-sm text-amber-800 mb-4">
        Symuluj płatność za egzamin. Po kliknięciu zostaniesz przeniesiona do egzaminu.
      </p>
      <div className="flex flex-wrap gap-3">
        {courses.map((course) => (
          <button
            key={course.slug}
            onClick={() => mockPayment(course.slug)}
            disabled={loading === course.slug}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            {loading === course.slug ? 'Zapisuję...' : `Kup egzamin: ${course.title}`}
          </button>
        ))}
      </div>
      <p className="text-xs text-amber-700 mt-3">
        Lub idź bezpośrednio na stronę płatności:{' '}
        {courses.map(c => (
          <a key={c.slug} href={`/egzamin/${c.slug}/platnosc`} className="underline mr-2">{c.slug}</a>
        ))}
      </p>
    </section>
  );
}
