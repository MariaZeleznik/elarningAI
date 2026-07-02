'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="font-heading font-bold text-2xl text-brand-navy mb-2">Coś poszło nie tak</h1>
        <p className="text-brand-muted mb-6 text-sm">
          Wystąpił nieoczekiwany błąd. Spróbuj ponownie lub wróć na stronę główną.
        </p>
        {error.digest && (
          <p className="text-xs text-brand-muted font-mono mb-6 bg-gray-100 px-3 py-2 rounded">
            ID błędu: {error.digest}
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-brand-teal text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-brand-teal/90 transition-colors"
          >
            Spróbuj ponownie
          </button>
          <Link
            href="/"
            className="bg-white border border-gray-200 text-brand-navy font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
          >
            Strona główna
          </Link>
        </div>
      </div>
    </div>
  );
}
