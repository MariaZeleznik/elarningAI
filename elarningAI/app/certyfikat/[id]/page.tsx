import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import { PrintButton } from './print-button';

interface Props { params: { id: string }; searchParams: { new?: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cert = await prisma.certificate.findUnique({
    where: { id: params.id },
    include: { course: true },
  });
  if (!cert) return { title: 'Certyfikat nie znaleziony' };
  return {
    title: `Certyfikat: ${cert.course.title} — Neurova AI Academy`,
    description: `Potwierdzenie ukończenia kursu ${cert.course.title} przez uczestnika Neurova AI Academy`,
    openGraph: {
      title: `Certyfikat ukończenia: ${cert.course.title}`,
      description: 'Weryfikacja certyfikatu Neurova AI Academy',
      type: 'website',
    },
  };
}

export default async function CertificatePage({ params, searchParams }: Props) {
  // Pobieramy certyfikat — NIGDY nie zwracamy email ani userId
  const cert = await prisma.certificate.findUnique({
    where: { id: params.id },
    include: {
      course: { select: { title: true, slug: true } },
      user: { select: { name: true } },
    },
  });

  if (!cert) notFound();

  const isNew = searchParams.new === '1';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://neurova.pl';
  const certUrl = `${siteUrl}/certyfikat/${cert.id}`;
  const linkedinUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.course.title)}&organizationName=Neurova+AI+Academy&issueYear=${new Date(cert.issuedAt).getFullYear()}&issueMonth=${new Date(cert.issuedAt).getMonth() + 1}&certUrl=${encodeURIComponent(certUrl)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-blue-900 to-teal-900 flex items-center justify-center px-4 py-16">
      {isNew && (
        <div className="fixed top-4 inset-x-4 z-50 flex justify-center">
          <div className="bg-green-500 text-white rounded-xl px-6 py-3 shadow-lg font-semibold text-sm animate-bounce">
            🎉 Gratulacje! Certyfikat wystawiony!
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl">
        {/* Certyfikat */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden print:shadow-none" id="certificate">
          {/* Złoty pasek górny */}
          <div className="h-3 bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold" />

          <div className="px-10 py-12 text-center">
            {/* Logo / Nazwa akademii */}
            <div className="mb-8">
              <p className="text-brand-muted text-sm font-medium uppercase tracking-widest mb-1">Neurova AI Academy</p>
              <div className="w-16 h-0.5 bg-brand-gold mx-auto" />
            </div>

            <p className="text-brand-muted uppercase tracking-widest text-xs mb-3">Certyfikat ukończenia</p>
            <h1 className="font-heading font-bold text-3xl text-brand-navy mb-2">{cert.user.name ?? 'Uczestnik'}</h1>
            <p className="text-brand-muted mb-8">ukończył/a z wynikiem pozytywnym kurs</p>

            <div className="bg-brand-gray rounded-2xl px-8 py-6 mb-8 inline-block w-full">
              <h2 className="font-heading font-bold text-xl text-brand-navy">{cert.course.title}</h2>
            </div>

            <p className="text-sm text-brand-muted mb-1">Data wystawienia</p>
            <p className="font-semibold text-brand-navy mb-8">{formatDate(cert.issuedAt)}</p>

            <div className="flex items-center justify-between text-xs text-brand-muted border-t border-gray-100 pt-6 mt-2">
              <div>
                <p className="font-medium text-brand-dark mb-0.5">ID certyfikatu</p>
                <p className="font-mono">{cert.id}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-brand-dark mb-0.5">Weryfikacja</p>
                <p className="break-all max-w-[200px]">{certUrl}</p>
              </div>
            </div>
          </div>

          <div className="h-3 bg-gradient-to-r from-brand-gold via-amber-400 to-brand-gold" />
        </div>

        {/* Przyciski akcji */}
        {isNew && (
          <div className="mt-6 mb-4 p-4 bg-white/10 rounded-2xl text-center">
            <p className="text-white font-semibold mb-1">Podziel się swoim osiągnięciem!</p>
            <p className="text-white/70 text-sm mb-4">Dodaj certyfikat do profilu LinkedIn — pokaż pracodawcom swoje nowe umiejętności.</p>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0A66C2] hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              Dodaj do LinkedIn teraz
            </a>
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-3 justify-center">
          <PrintButton />
          <Link
            href="/certyfikaty"
            className="flex items-center gap-2 text-white/80 hover:text-white font-medium px-6 py-2.5 rounded-xl transition-colors text-sm border border-white/20 hover:border-white/50"
          >
            Moje certyfikaty
          </Link>
          {!isNew && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/60 hover:text-white/90 text-sm px-4 py-2.5 transition-colors"
            >
              Udostępnij na LinkedIn
            </a>
          )}
        </div>

        <p className="text-center text-xs text-white/60 mt-4">
          Ten certyfikat można zweryfikować pod adresem: <span className="text-white/80">{certUrl}</span>
        </p>
      </div>
    </div>
  );
}
