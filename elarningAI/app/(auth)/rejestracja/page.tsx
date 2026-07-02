import type { Metadata } from 'next';
import { RegisterForm } from './register-form';

export const metadata: Metadata = {
  title: 'Zarejestruj się',
  robots: { index: false },
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-navy to-blue-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading font-bold text-3xl text-white mb-2">Zacznij naukę za darmo</h1>
          <p className="text-gray-300">Neurova AI Academy — kursy AI i analityki danych po polsku</p>
        </div>
        <RegisterForm />
        <p className="text-center text-gray-400 text-sm mt-6">
          Masz już konto?{' '}
          <a href="/logowanie" className="text-brand-gold hover:text-amber-400 font-medium transition-colors">
            Zaloguj się
          </a>
        </p>
      </div>
    </div>
  );
}
