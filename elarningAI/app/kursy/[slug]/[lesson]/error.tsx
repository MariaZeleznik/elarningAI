'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function LessonError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[LessonError]', error.message, error.stack);
  }, [error]);

  const params = useParams();
  const courseSlug = params?.slug as string;
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 className="font-heading font-bold text-xl text-brand-navy mb-2">
        Nie udało się wczytać lekcji
      </h1>
      <p className="text-brand-muted text-sm mb-6">
        Treść lekcji jest tymczasowo niedostępna. Spróbuj ponownie.
      </p>

      {isDev && (
        <details className="mb-6 text-left rounded-xl border border-red-200 bg-red-50 p-4">
          <summary className="text-xs font-semibold text-red-600 cursor-pointer">
            Szczegóły błędu (tryb dev)
          </summary>
          <pre className="mt-3 text-xs text-red-700 whitespace-pre-wrap break-all leading-relaxed">
            {error.message}
            {'\n\n'}
            {error.stack}
          </pre>
        </details>
      )}

      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="bg-brand-teal text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-brand-teal/90 transition-colors"
        >
          Spróbuj ponownie
        </button>
        {courseSlug && (
          <Link
            href={`/kursy/${courseSlug}`}
            className="bg-white border border-gray-200 text-brand-navy font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
          >
            Wróć do kursu
          </Link>
        )}
      </div>
    </div>
  );
}
