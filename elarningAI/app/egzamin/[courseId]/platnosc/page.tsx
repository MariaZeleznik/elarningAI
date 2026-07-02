import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getCourse } from '@/lib/courses';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { PaymentForm } from './payment-form';

interface Props { params: { courseId: string } }

export const metadata = { title: 'Kup dostęp do egzaminu', robots: { index: false } };

export default async function PaymentPage({ params }: Props) {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch { /* treat as unauthenticated */ }
  if (!session) redirect(`/logowanie?callbackUrl=/egzamin/${params.courseId}/platnosc`);

  const course = getCourse(params.courseId);
  if (!course) notFound();

  // Sprawdź czy nie ma już aktywnej płatności
  const existing = await prisma.payment.findFirst({
    where: { userId: session.user.id, courseId: (await prisma.course.findUnique({ where: { slug: course.slug } }))?.id, status: 'SUCCESS' },
  });
  if (existing) redirect(`/egzamin/${params.courseId}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy to-blue-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-6">
            <h1 className="font-heading font-bold text-2xl text-brand-navy mb-2">Dostęp do egzaminu</h1>
            <p className="text-brand-muted">{course.title}</p>
          </div>

          <div className="bg-brand-gray rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-brand-dark">Egzamin certyfikacyjny</span>
              <span className="font-bold text-brand-navy text-lg">{formatPrice(course.priceGrosze)}</span>
            </div>
            <p className="text-xs text-brand-muted mt-2">Jednorazowa opłata za jedno podejście do egzaminu</p>
          </div>

          <PaymentForm courseId={params.courseId} amountGrosze={course.priceGrosze} />

          <div className="mt-4 flex items-center gap-2 justify-center text-xs text-brand-muted">
            <span>🔒</span>
            <span>Bezpieczna płatność przez Przelewy24 · BLIK · Przelew · Karta</span>
          </div>

          <div className="mt-4 text-xs text-brand-muted space-y-1">
            <p className="flex items-start gap-1">
              <input type="checkbox" checked disabled className="mt-0.5 accent-brand-teal" />
              <span>Mam co najmniej 18 lat i mogę zawierać umowy online</span>
            </p>
            <p className="flex items-start gap-1">
              <input type="checkbox" checked disabled className="mt-0.5 accent-brand-teal" />
              <span>Egzamin (treść cyfrowa) jest dostępny natychmiast — tracę prawo do odstąpienia (art. 38 ust. 13 UPK)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
