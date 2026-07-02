import Link from 'next/link';
import { redirect } from 'next/navigation';

interface Props { params: { courseId: string }; searchParams: { score?: string; passed?: string } }

export const metadata = { title: 'Wynik egzaminu', robots: { index: false } };

export default function ExamResultPage({ params, searchParams }: Props) {
  const score = Number(searchParams.score ?? 0);
  const passed = searchParams.passed === '1';

  if (passed) redirect(`/egzamin/${params.courseId}`);

  return (
    <div className="min-h-screen bg-brand-gray flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full shadow-lg text-center">
        <div className="text-5xl mb-4">😔</div>
        <h1 className="font-heading font-bold text-2xl text-brand-navy mb-2">Nie udało się tym razem</h1>
        <p className="text-brand-muted mb-4">Twój wynik: <span className="font-bold text-2xl text-brand-navy">{score}%</span></p>
        <p className="text-sm text-brand-muted mb-8">
          Wymagane minimum to <strong>70%</strong>. Nie martw się — wróć do materiałów i spróbuj ponownie!
        </p>
        <div className="space-y-3">
          <Link
            href={`/kursy/${params.courseId}`}
            className="block w-full text-center bg-brand-teal hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Powtórz materiał →
          </Link>
          <Link
            href="/panel"
            className="block text-sm text-brand-muted hover:text-brand-navy transition-colors"
          >
            Wróć do panelu
          </Link>
        </div>
      </div>
    </div>
  );
}
