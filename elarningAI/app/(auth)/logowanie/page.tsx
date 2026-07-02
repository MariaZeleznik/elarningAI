import type { Metadata } from 'next';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Zaloguj się',
  robots: { index: false },
};

export default function LoginPage({ searchParams }: { searchParams: { verify?: string; error?: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-navy to-blue-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading font-bold text-3xl text-white mb-2">Neurova AI Academy</h1>
          <p className="text-gray-300">Zaloguj się swoim adresem email</p>
        </div>

        {searchParams.verify && (
          <div className="bg-green-900/50 border border-green-500/50 text-green-200 rounded-xl p-4 mb-6 text-sm text-center">
            ✓ Link logowania wysłany! Sprawdź swoją skrzynkę email.
            <br />
            <span className="text-xs text-green-300/70 mt-1 block">(W trybie dev — sprawdź konsolę serwera)</span>
          </div>
        )}

        {searchParams.error && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-200 rounded-xl p-4 mb-6 text-sm text-center">
            Błąd logowania. Spróbuj ponownie lub skontaktuj się z pomocą.
          </div>
        )}

        <LoginForm devMode={
          process.env.EMAIL_PROVIDER === 'console' ||
          process.env.DEV_LOGIN_ENABLED === 'true'
        } />

        <p className="text-center text-gray-400 text-sm mt-6">
          Nie masz konta?{' '}
          <a href="/rejestracja" className="text-brand-gold hover:text-amber-400 font-medium transition-colors">
            Zarejestruj się za darmo
          </a>
        </p>
      </div>
    </div>
  );
}
