import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { SignOutButton } from './sign-out-button';

export const metadata = { title: 'Mój profil', robots: { index: false } };

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/logowanie');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      marketingConsent: true,
      currentStreak: true,
      longestStreak: true,
      lastActiveAt: true,
      _count: { select: { certificates: true, examAttempts: true, progress: true } },
    },
  });

  if (!user) redirect('/logowanie');

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="font-heading font-bold text-2xl text-brand-navy">Mój profil</h1>
        <p className="text-brand-muted mt-1">Twoje konto Neurova AI Academy</p>
      </header>

      {/* Avatar + basic info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-brand-teal/20 flex items-center justify-center text-2xl font-bold text-brand-teal shrink-0">
            {(user.name ?? user.email)[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <h2 className="font-heading font-bold text-xl text-brand-navy">{user.name ?? 'Uczestnik'}</h2>
            <p className="text-brand-muted text-sm">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-brand-teal/10 text-brand-teal'}`}>
                {user.role === 'ADMIN' ? 'Administrator' : 'Uczestnik'}
              </span>
              <span className="text-xs text-brand-muted">Konto od {formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Lekcji ukończono', value: user._count.progress },
          { label: 'Certyfikatów', value: user._count.certificates },
          { label: 'Streak', value: `${user.currentStreak}🔥` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
            <p className="font-heading font-bold text-2xl text-brand-navy">{s.value}</p>
            <p className="text-xs text-brand-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Ustawienia konta */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-heading font-semibold text-brand-navy mb-4">Ustawienia konta</h3>
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between py-3 border-b border-gray-50">
            <span className="text-brand-dark">E-mail</span>
            <span className="text-brand-muted font-mono">{user.email}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-50">
            <span className="text-brand-dark">Marketing</span>
            <span className={`font-medium ${user.marketingConsent ? 'text-brand-teal' : 'text-brand-muted'}`}>
              {user.marketingConsent ? 'Zgoda udzielona' : 'Brak zgody'}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-brand-dark">Ostatnia aktywność</span>
            <span className="text-brand-muted">{formatDate(user.lastActiveAt)}</span>
          </div>
        </div>
      </div>

      {/* Akcje */}
      <div className="space-y-3">
        <SignOutButton />
        <div className="text-center">
          <a href="mailto:hello@neurova.pl?subject=Usunięcie konta" className="text-xs text-brand-muted hover:text-red-600 transition-colors">
            Usuń konto (napisz do nas)
          </a>
        </div>
      </div>
    </div>
  );
}
