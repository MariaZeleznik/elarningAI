'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type ConsentState = { necessary: boolean; functional: boolean; marketing: boolean };

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState<ConsentState>({ necessary: true, functional: false, marketing: false });

  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) setShow(true);
  }, []);

  function save(consent: ConsentState) {
    localStorage.setItem('cookie-consent', JSON.stringify({ ...consent, timestamp: new Date().toISOString() }));
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Ustawienia plików cookie"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 p-5"
    >
      <p className="font-heading font-semibold text-brand-navy mb-2">🍪 Pliki cookie</p>
      <p className="text-sm text-brand-muted mb-4">
        Używamy niezbędnych plików cookie (sesja, CSRF). Marketingowe tylko za Twoją zgodą.{' '}
        <Link href="/polityka-cookies" className="underline hover:text-brand-teal">Dowiedz się więcej</Link>
      </p>

      {expanded && (
        <div className="mb-4 space-y-3 text-sm border rounded-xl p-3 bg-gray-50">
          <label className="flex items-center gap-2 opacity-60">
            <input type="checkbox" checked disabled className="accent-brand-teal" />
            <span><strong>Niezbędne</strong> — sesja logowania, CSRF</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={prefs.functional}
              onChange={(e) => setPrefs({ ...prefs, functional: e.target.checked })}
              className="accent-brand-teal"
            />
            <span><strong>Funkcjonalne</strong> — cookies przekierowania Przelewy24</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={prefs.marketing}
              onChange={(e) => setPrefs({ ...prefs, marketing: e.target.checked })}
              className="accent-brand-teal"
            />
            <span><strong>Marketingowe</strong> — śledzenie emaili Brevo</span>
          </label>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="flex-1 border border-gray-200" onClick={() => save({ necessary: true, functional: false, marketing: false })}>
            Tylko niezbędne
          </Button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 text-sm text-brand-muted border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors"
          >
            {expanded ? 'Zwiń ▴' : 'Dostosuj ▾'}
          </button>
        </div>
        <Button size="sm" onClick={() => save({ necessary: true, functional: true, marketing: true })}>
          Zaakceptuj wszystkie
        </Button>
        {expanded && (
          <Button variant="outline" size="sm" onClick={() => save(prefs)}>
            Zapisz preferencje
          </Button>
        )}
      </div>
    </div>
  );
}
