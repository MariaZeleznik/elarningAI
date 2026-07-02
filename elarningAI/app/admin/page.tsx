import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatDate, formatPrice } from '@/lib/utils';

export const metadata = { title: 'Admin — Neurova', robots: { index: false } };

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect('/');

  const [userCount, certCount, payments, recentUsers, recentLogs] = await Promise.all([
    prisma.user.count(),
    prisma.certificate.count(),
    prisma.payment.findMany({ where: { status: 'SUCCESS' }, include: { course: true }, orderBy: { createdAt: 'desc' }, take: 10 }),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, name: true, email: true, role: true, createdAt: true } }),
    prisma.securityLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
  ]);

  const revenue = payments.reduce((sum, p) => sum + p.expectedAmountGrosze, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl text-brand-navy">Panel administracyjny</h1>
          <p className="text-brand-muted mt-1">Neurova AI Academy · {formatDate(new Date())}</p>
        </div>
        <Link href="/admin/aktualizacje" className="bg-brand-teal hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
          Aktualizacje treści →
        </Link>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Użytkownicy', value: userCount, icon: '👥' },
          { label: 'Certyfikaty', value: certCount, icon: '🏆' },
          { label: 'Płatności', value: payments.length, icon: '💳' },
          { label: 'Przychód', value: formatPrice(revenue), icon: '💰' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="font-heading font-bold text-2xl text-brand-navy">{s.value}</div>
            <div className="text-sm text-brand-muted">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Ostatnie płatności */}
        <section>
          <h2 className="font-heading font-semibold text-brand-navy mb-3">Ostatnie płatności</h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {payments.length === 0 ? (
              <p className="p-6 text-brand-muted text-sm">Brak płatności</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-brand-gray">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-brand-muted uppercase">Kurs</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-brand-muted uppercase">Kwota</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-brand-muted uppercase">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-3 text-brand-dark truncate max-w-[150px]">{p.course.title}</td>
                      <td className="px-4 py-3 text-right font-medium text-brand-navy">{formatPrice(p.expectedAmountGrosze)}</td>
                      <td className="px-4 py-3 text-right text-brand-muted">{formatDate(p.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Ostatni użytkownicy */}
        <section>
          <h2 className="font-heading font-semibold text-brand-navy mb-3">Nowi użytkownicy</h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-brand-gray">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-brand-muted uppercase">Email</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-brand-muted uppercase">Rola</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 text-brand-dark truncate max-w-[200px]">{u.email}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Logi bezpieczeństwa */}
        {recentLogs.length > 0 && (
          <section className="md:col-span-2">
            <h2 className="font-heading font-semibold text-brand-navy mb-3">Logi bezpieczeństwa</h2>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-brand-gray">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-brand-muted uppercase">Zdarzenie</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-brand-muted uppercase">IP</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-brand-muted uppercase">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-4 py-3 text-brand-dark">{log.event}</td>
                      <td className="px-4 py-3 font-mono text-brand-muted">{log.ip ?? '—'}</td>
                      <td className="px-4 py-3 text-right text-brand-muted">{formatDate(log.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
