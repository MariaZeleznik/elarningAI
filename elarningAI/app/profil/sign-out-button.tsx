'use client';
import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="w-full border border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600 font-semibold px-4 py-3 rounded-xl transition-colors text-sm"
    >
      Wyloguj się
    </button>
  );
}
