'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

interface NavbarProps {
  devMode?: boolean;
}

export function Navbar({ devMode }: NavbarProps) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [devLoading, setDevLoading] = useState(false);

  async function quickDevLogin() {
    setDevLoading(true);
    try {
      const res = await fetch('/api/dev/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      });
      if (res.ok) {
        window.location.href = '/panel';
      } else {
        const d = await res.json();
        alert(`Dev login błąd: ${d.error}`);
      }
    } finally {
      setDevLoading(false);
    }
  }

  return (
    <header className="bg-brand-navy text-white sticky top-0 z-40 shadow-md">
      {/* Dev mode bar */}
      {devMode && !session && (
        <div className="bg-amber-500 text-black text-xs text-center py-1 px-4 flex items-center justify-center gap-3">
          <span className="font-semibold">🔧 Tryb dev</span>
          <button
            onClick={quickDevLogin}
            disabled={devLoading}
            className="bg-black/10 hover:bg-black/20 font-bold px-3 py-0.5 rounded-full transition-colors disabled:opacity-50"
          >
            {devLoading ? 'Loguję...' : '⚡ Zaloguj jako test@example.com'}
          </button>
        </div>
      )}

      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between" aria-label="Nawigacja główna">
        <Link href="/" className="font-heading font-bold text-xl text-white hover:text-brand-gold transition-colors">
          Neurova <span className="text-brand-gold">AI Academy</span>
        </Link>

        <div className="hidden md:flex items-center gap-5 text-sm font-medium">
          <Link href="/kursy" className="hover:text-brand-gold transition-colors">Kursy</Link>
          <Link href="/blog" className="hover:text-brand-gold transition-colors">Blog</Link>
          {session ? (
            <>
              <Link href="/panel" className="hover:text-brand-gold transition-colors">Panel</Link>
              {session.user.role === 'ADMIN' && (
                <Link href="/admin" className="hover:text-brand-gold transition-colors text-brand-gold">Admin</Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="border border-white/30 hover:border-brand-gold px-4 py-2 rounded-lg transition-colors"
              >
                Wyloguj
              </button>
            </>
          ) : (
            <>
              <Link href="/logowanie" className="hover:text-brand-gold transition-colors">Zaloguj się</Link>
              <Link
                href="/rejestracja"
                className="bg-brand-teal hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Zacznij za darmo
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'}
          aria-expanded={menuOpen}
        >
          <span className="block w-6 h-0.5 bg-white mb-1.5" />
          <span className="block w-6 h-0.5 bg-white mb-1.5" />
          <span className="block w-6 h-0.5 bg-white" />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 px-4 py-4 flex flex-col gap-4 text-sm font-medium">
          <Link href="/kursy" onClick={() => setMenuOpen(false)} className="hover:text-brand-gold transition-colors">Kursy</Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)} className="hover:text-brand-gold transition-colors">Blog</Link>
          {session ? (
            <>
              <Link href="/panel" onClick={() => setMenuOpen(false)}>Panel</Link>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="text-left text-red-300">Wyloguj</button>
            </>
          ) : (
            <>
              <Link href="/logowanie" onClick={() => setMenuOpen(false)}>Zaloguj się</Link>
              <Link href="/rejestracja" onClick={() => setMenuOpen(false)} className="bg-brand-teal text-white px-4 py-2 rounded-lg text-center">
                Zacznij za darmo
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
