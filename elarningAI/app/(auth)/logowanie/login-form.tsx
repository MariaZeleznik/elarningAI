'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  devMode?: boolean;
}

export function LoginForm({ devMode }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [devLoading, setDevLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await signIn('email', { email, redirect: false, callbackUrl: '/panel' });
      if (res?.error) {
        toast.error('Coś poszło nie tak. Sprawdź adres email i spróbuj ponownie.');
        return;
      }
      window.location.href = '/logowanie?verify=1';
    } finally {
      setLoading(false);
    }
  }

  async function handleDevLogin(targetEmail: string) {
    setDevLoading(true);
    try {
      // Direct JWT session creation — bypasses credentials provider flow
      const res = await fetch('/api/dev/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(`Dev login błąd: ${data.error ?? res.statusText}`);
        return;
      }

      toast.success(`Zalogowano jako ${data.email}! Przekierowanie...`);
      await new Promise(r => setTimeout(r, 800));
      window.location.href = '/panel';
    } catch (err) {
      toast.error('Błąd połączenia z serwerem');
    } finally {
      setDevLoading(false);
    }
  }

  if (devMode) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <div className="mb-6 text-center">
          <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            🔧 Tryb deweloperski
          </span>
          <h2 className="font-heading font-bold text-xl text-brand-navy">Szybkie logowanie</h2>
          <p className="text-sm text-brand-muted mt-1">Bez emaila — bezpośredni JWT login</p>
        </div>
        <button
          onClick={() => handleDevLogin('test@example.com')}
          disabled={devLoading}
          className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-60 text-black font-bold px-6 py-4 rounded-xl text-base transition-colors touch-target"
        >
          {devLoading ? '⏳ Logowanie...' : '⚡ Zaloguj jako test@example.com'}
        </button>
        <p className="text-xs text-center text-gray-400 mt-4">
          Kliknij raz — zostaniesz zalogowany i przekierowany do panelu.
        </p>
        <hr className="my-5 border-gray-100" />
        <details className="group">
          <summary className="text-xs text-center text-gray-400 cursor-pointer select-none hover:text-gray-600 transition-colors">
            Użyj zwykłego logowania emailem ▾
          </summary>
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <Input
              id="email"
              type="email"
              label="Adres email"
              placeholder="twoj@email.pl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Button type="submit" className="w-full" loading={loading}>
              Wyślij link logowania →
            </Button>
          </form>
        </details>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl">
      <Input
        id="email"
        type="email"
        label="Adres email"
        placeholder="twoj@email.pl"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        autoFocus
      />
      <Button type="submit" className="w-full mt-4" loading={loading} size="lg">
        Wyślij link logowania →
      </Button>
      <p className="text-xs text-center text-gray-400 mt-4">
        Wyślemy Ci jednorazowy link logowania — bez hasła.
      </p>
    </form>
  );
}
