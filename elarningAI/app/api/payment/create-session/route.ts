import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createPaymentSession } from '@/lib/payment';

const schema = z.object({
  courseId: z.string().min(1),
  amountGrosze: z.number().int().positive(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Bad request' }, { status: 400 });

  const { courseId, amountGrosze } = parsed.data;

  const course = await prisma.course.findUnique({ where: { slug: courseId } });
  if (!course) return Response.json({ error: 'Course not found' }, { status: 404 });

  const existing = await prisma.payment.findFirst({
    where: { userId: session.user.id, courseId: course.id, status: 'SUCCESS' },
  });
  if (existing) return Response.json({ error: 'Already paid' }, { status: 409 });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const returnUrl = `${baseUrl}/api/payment/webhook?courseId=${courseId}`;

  const paySession = await createPaymentSession({
    courseSlug: courseId,
    userId: session.user.id,
    amountGrosze,
    email: session.user.email!,
    returnUrl,
  });

  await prisma.payment.create({
    data: {
      userId: session.user.id,
      courseId: course.id,
      p24SessionId: paySession.sessionId,
      expectedAmountGrosze: amountGrosze,
      status: 'PENDING',
    },
  });

  return Response.json({ redirectUrl: paySession.redirectUrl });
}
