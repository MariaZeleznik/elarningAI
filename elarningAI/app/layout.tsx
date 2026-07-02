import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/layout/navbar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { CookieBanner } from '@/components/cookies/cookie-banner';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--font-inter', preload: true });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin', 'latin-ext'], display: 'swap', variable: '--font-plus-jakarta', preload: true });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-jetbrains-mono', preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://neurova.pl'),
  title: { template: '%s | Neurova AI Academy', default: 'Neurova AI Academy — Kursy AI i Analityki Danych po Polsku' },
  description: 'Darmowe kursy AI i analityki danych po polsku. Certyfikat potwierdzony egzaminem. Zacznij dziś na Neurova AI Academy.',
  openGraph: {
    locale: 'pl_PL',
    type: 'website',
    siteName: 'Neurova AI Academy',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Neurova AI Academy — Kursy AI i Analityki Danych po Polsku' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.svg'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1B2E4B',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch {
    // getServerSession failed — proceed without session
  }
  const devMode = process.env.EMAIL_PROVIDER === 'console';
  return (
    <html lang="pl" className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-brand-gray">
        <Providers session={session}>
          <Navbar devMode={devMode} />
          <main className="min-h-screen pb-20 md:pb-0">{children}</main>
          <footer className="hidden md:block bg-brand-navy text-gray-400 text-sm py-8 px-4">
            <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-500">© {new Date().getFullYear()} Neurova AI Academy</p>
              <nav className="flex flex-wrap gap-4 justify-center">
                <Link href="/kursy" className="hover:text-white transition-colors">Kursy</Link>
                <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                <Link href="/polityka-prywatnosci" className="hover:text-white transition-colors">Polityka prywatności</Link>
                <Link href="/regulamin" className="hover:text-white transition-colors">Regulamin</Link>
                <Link href="/polityka-cookies" className="hover:text-white transition-colors">Cookies</Link>
              </nav>
            </div>
          </footer>
          <MobileNav />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
