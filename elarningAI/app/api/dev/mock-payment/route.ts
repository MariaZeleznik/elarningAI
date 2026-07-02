import { NextRequest, NextResponse } from 'next/server';
import { decode } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { getCourse } from '@/lib/courses';

// Dev-only: records a SUCCESS payment and ensures the Course DB record exists.
// Bypasses P24 payment flow for testing.
export async function POST(req: NextRequest) {
  if (process.env.EMAIL_PROVIDER !== 'console') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const { courseSlug } = await req.json();
  if (!courseSlug) return NextResponse.json({ error: 'courseSlug required' }, { status: 400 });

  // Read user from JWT cookie
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
  const isSecure = process.env.NEXTAUTH_URL?.startsWith('https://') ?? false;
  const cookieName = isSecure ? '__Secure-next-auth.session-token' : 'next-auth.session-token';
  const sessionToken = req.cookies.get(cookieName)?.value;

  if (!sessionToken || !secret) {
    return NextResponse.json({ error: 'Not authenticated — use dev login first' }, { status: 401 });
  }

  const token = await decode({ token: sessionToken, secret });
  const userId = token?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: 'Invalid session token' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const courseMeta = getCourse(courseSlug);
  if (!courseMeta) return NextResponse.json({ error: 'Course not found in files' }, { status: 404 });

  // Ensure course exists in DB
  const course = await prisma.course.upsert({
    where: { slug: courseSlug },
    update: {},
    create: {
      slug: courseSlug,
      title: courseMeta.title,
      description: courseMeta.description,
      priceGrosze: courseMeta.priceGrosze,
    },
  });

  // Idempotent: create payment only if none with SUCCESS status exists
  const existing = await prisma.payment.findFirst({
    where: { userId, courseId: course.id, status: 'SUCCESS' },
  });

  if (!existing) {
    await prisma.payment.create({
      data: {
        userId,
        courseId: course.id,
        expectedAmountGrosze: course.priceGrosze,
        status: 'SUCCESS',
      },
    });
  }

  return NextResponse.json({ ok: true, courseId: course.id, message: 'Payment recorded as SUCCESS' });
}
