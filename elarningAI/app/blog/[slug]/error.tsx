'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[BlogPostError]', error.message);
  }, [error]);

  const isMdxError = error.message?.includes('MDX') || error.message?.includes('mdx');

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h1 className="font-heading font-bold text-2xl text-brand-navy mb-2">
        Nie udało się wczytać artykułu
      </h1>
      <p className="text-brand-muted text-sm mb-2">
        {isMdxError
          ? 'Wystąpił błąd podczas renderowania treści. Skontaktuj się z administratorem.'
          : 'Artykuł jest tymczasowo niedostępny.'}
      </p>
      {error.digest && (
        <p className="text-xs text-brand-muted font-mono mb-6 bg-gray-100 inline-block px-3 py-1.5 rounded">
          Błąd: {error.digest}
        </p>
      )}
      <div className="flex gap-3 justify-center mt-6">
        <button
          onClick={reset}
          className="bg-brand-teal text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-brand-teal/90 transition-colors"
        >
          Spróbuj ponownie
        </button>
        <Link
          href="/blog"
          className="bg-white border border-gray-200 text-brand-navy font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
        >
          Wróć do bloga
        </Link>
      </div>
    </div>
  );
}
