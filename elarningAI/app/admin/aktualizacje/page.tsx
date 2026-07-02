import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Aktualizacje treści — Admin', robots: { index: false } };

export default async function UpdatesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect('/');

  const logs = await prisma.contentUpdateLog.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 50,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-8">
        <h1 className="font-heading font-bold text-2xl text-brand-navy">Aktualizacje treści</h1>
        <p className="text-brand-muted mt-1">Historia zmian w kursach i pytaniach egzaminacyjnych</p>
      </header>

      {logs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <p className="text-brand-muted">Brak zarejestrowanych aktualizacji</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-brand-gray">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-brand-muted uppercase">Typ</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-brand-muted uppercase">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-brand-muted uppercase">Zmienione pola</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-brand-muted uppercase">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-brand-gray/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${log.entityType === 'COURSE' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {log.entityType}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-brand-dark text-xs">{log.entitySlug}</td>
                  <td className="px-4 py-3 text-brand-muted">{log.changedFields}</td>
                  <td className="px-4 py-3 text-right text-brand-muted">{formatDate(log.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
