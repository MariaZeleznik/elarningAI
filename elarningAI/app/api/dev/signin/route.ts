import { NextRequest, NextResponse } from 'next/server';
import { encode } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

// Dev-only: creates a NextAuth JWT session directly without going through the credentials flow.
// Used when signIn('dev-credentials') has issues due to adapter/config problems.
const devLoginAllowed =
  process.env.EMAIL_PROVIDER === 'console' ||
  process.env.DEV_LOGIN_ENABLED === 'true';

export async function POST(req: NextRequest) {
  if (!devLoginAllowed) {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });

  const user = await prisma.user.upsert({
    where: { email },
    update: { emailVerified: new Date() },
    create: {
      email,
      name: email.split('@')[0],
      role: 'USER',
      emailVerified: new Date(),
    },
  });

  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'NEXTAUTH_SECRET not configured' }, { status: 500 });
  }

  const token = await encode({
    token: {
      sub: user.id,
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.image,
      role: user.role,
    },
    secret,
    maxAge: 30 * 24 * 60 * 60,
  });

  const isSecure = process.env.NEXTAUTH_URL?.startsWith('https://') ?? false;
  const cookieName = isSecure ? '__Secure-next-auth.session-token' : 'next-auth.session-token';

  const response = NextResponse.json({ ok: true, email: user.email });
  response.cookies.set(cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: isSecure,
    maxAge: 30 * 24 * 60 * 60,
  });

  return response;
}
