import { NextRequest, NextResponse } from 'next/server';
import { getDevMagicLink } from '@/lib/auth';

// Dev-only endpoint: returns the plaintext magic link URL captured in sendVerificationRequest.
// NextAuth hashes the token before storing in DB, so we cannot reconstruct the URL from DB.
export async function POST(req: NextRequest) {
  if (process.env.EMAIL_PROVIDER !== 'console') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });

  const url = getDevMagicLink(email);
  if (!url) {
    return NextResponse.json(
      { error: 'No pending magic link. Submit the login form first.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ url });
}
