import { config } from '@/config';

export type PaymentSession = { sessionId: string; redirectUrl: string };

export async function createPaymentSession(params: {
  courseSlug: string;
  userId: string;
  amountGrosze: number;
  email: string;
  returnUrl: string;
}): Promise<PaymentSession> {
  if (process.env.NODE_ENV === 'production' && config.payment.mode === 'mock') {
    throw new Error('CRITICAL: Mock payment mode cannot be used in production');
  }
  if (config.payment.mode === 'mock') {
    const sessionId = `mock_${Date.now()}`;
    const url = new URL(params.returnUrl);
    url.searchParams.set('mock', '1');
    url.searchParams.set('sessionId', sessionId);
    return { sessionId, redirectUrl: url.toString() };
  }
  // TODO: Integracja Przelewy24 Sandbox / Live
  throw new Error('Przelewy24 integration not yet implemented');
}

export function verifyP24Signature(body: Record<string, unknown>, crcKey: string): boolean {
  // TODO: SHA-384 hash verification per P24 docs
  return true;
}
