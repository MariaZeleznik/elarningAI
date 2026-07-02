'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [terms, setTerms] = useState(false);
  const [age, setAge] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!terms || !age) { toast.error('Zaznacz wymagane zgody.'); return; }
    setLoading(true);
    try {
      // Utwórz konto przez API, potem wyślij magic link
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, marketingConsent: marketing }),
      });
      if (!res.ok) { const d = await res.json(); toast.error(d.error ?? 'Błąd rejestracji'); return; }
      await signIn('email', { email, redirect: false, callbackUrl: '/panel' });
      window.location.href = '/logowanie?verify=1';
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl space-y-4">
      <Input id="name" type="text" label="Imię i nazwisko" placeholder="Anna Kowalska" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
      <Input id="email" type="email" label="Adres email" placeholder="twoj@email.pl" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />

      <div className="space-y-3 pt-2">
        <label className="flex items-start gap-3 cursor-pointer text-sm text-brand-dark">
          <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-0.5 accent-brand-teal" required />
          <span>Akceptuję <a href="/regulamin" className="underline hover:text-brand-teal">Regulamin</a> i <a href="/polityka-prywatnosci" className="underline hover:text-brand-teal">Politykę Prywatności</a> <span className="text-red-500">*</span></span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer text-sm text-brand-dark">
          <input type="checkbox" checked={age} onChange={(e) => setAge(e.target.checked)} className="mt-0.5 accent-brand-teal" required />
          <span>Mam co najmniej 16 lat <span className="text-red-500">*</span></span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer text-sm text-brand-muted">
          <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-0.5 accent-brand-teal" />
          <span>Chcę otrzymywać newsletter z materiałami edukacyjnymi (opcjonalne)</span>
        </label>
      </div>

      <Button type="submit" className="w-full" loading={loading} size="lg">
        Załóż konto i zacznij naukę →
      </Button>
      <p className="text-xs text-center text-gray-400">
        Wyślemy Ci link logowania — bez hasła, bez zbędnych danych.
      </p>
    </form>
  );
}
