'use client';

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 border border-gray-200 hover:border-brand-navy text-brand-dark hover:text-brand-navy font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
    >
      Drukuj / PDF
    </button>
  );
}
