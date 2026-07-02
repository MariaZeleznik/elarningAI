import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Moje certyfikaty', robots: { index: false } };

export default async function CertificatesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/logowanie');

  const certs = await prisma.certificate.findMany({
    where: { userId: session.user.id },
    include: { course: { select: { title: true, slug: true } } },
    orderBy: { issuedAt: 'desc' },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="font-heading font-bold text-2xl text-brand-navy">Moje certyfikaty</h1>
        <p className="text-brand-muted mt-1">Wszystkie Twoje certyfikaty Neurova AI Academy</p>
      </header>

      {certs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="text-5xl mb-4">🏆</div>
          <p className="text-brand-muted mb-6">Nie masz jeszcze żadnych certyfikatów.<br />Ukończ kurs i zdaj egzamin, by zdobyć certyfikat.</p>
          <Link href="/kursy" className="bg-brand-teal hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl inline-block transition-colors">
            Przeglądaj kursy →
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {certs.map((cert) => (
            <div key={cert.id} className="bg-white rounded-2xl p-6 border border-brand-gold/20 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center shrink-0">
                  <span className="text-2xl">🏆</span>
                </div>
                <div className="min-w-0">
                  <h2 className="font-heading font-bold text-brand-navy leading-tight mb-1">{cert.course.title}</h2>
                  <p className="text-sm text-brand-muted">{formatDate(cert.issuedAt)}</p>
                </div>
              </div>
              <Link
                href={`/certyfikat/${cert.id}`}
                className="block w-full text-center bg-brand-navy hover:bg-blue-900 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
              >
                Otwórz certyfikat →
              </Link>
              <p className="text-xs text-brand-muted mt-3 font-mono truncate">ID: {cert.id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
