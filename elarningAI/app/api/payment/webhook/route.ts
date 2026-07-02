import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { config } from '@/config';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const courseId = searchParams.get('courseId');
  const sessionId = searchParams.get('sessionId');
  const isMock = searchParams.get('mock') === '1';

  if (!courseId) return new Response('Missing courseId', { status: 400 });

  if (isMock && config.payment.mode === 'mock') {
    const course = await prisma.course.findUnique({ where: { slug: courseId } });
    if (course && sessionId) {
      await prisma.payment.updateMany({
        where: { p24SessionId: sessionId },
        data: { status: 'SUCCESS' },
      });
    }
    return Response.redirect(
      new URL(`/egzamin/${courseId}?paid=1`, process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    );
  }

  // TODO: Przelewy24 webhook verification (POST with SHA-384 signature)
  return new Response('Not implemented', { status: 501 });
}

export async function POST(req: NextRequest) {
  // TODO: Weryfikacja podpisu Przelewy24 i aktualizacja Payment.status = 'SUCCESS'
  return new Response('Not implemented', { status: 501 });
}
