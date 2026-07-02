import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1'
  );
}

export default withAuth(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // Admin: IP allowlist — fail-safe deny
    if (pathname.startsWith('/admin')) {
      const rawAllowedIPs = process.env.ADMIN_ALLOWED_IPS;
      if (!rawAllowedIPs || rawAllowedIPs.trim() === '') {
        console.error('[security] ADMIN_ALLOWED_IPS not set — blocking all admin access');
        return NextResponse.json({ error: 'Admin access not configured' }, { status: 403 });
      }
      const allowedIPs = rawAllowedIPs.split(',').map((ip) => ip.trim()).filter(Boolean);
      const clientIP = getClientIP(req);
      if (!allowedIPs.includes(clientIP)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      // Admin role check
      const token = (req as any).nextauth?.token;
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/logowanie', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    pages: { signIn: '/logowanie' },
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;
        const protectedPaths = ['/panel', '/certyfikaty', '/postep', '/egzamin', '/admin', '/profil'];
        if (protectedPaths.some((p) => pathname.startsWith(p))) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/panel/:path*', '/certyfikaty/:path*', '/postep/:path*', '/egzamin/:path*', '/admin/:path*', '/profil/:path*'],
};
