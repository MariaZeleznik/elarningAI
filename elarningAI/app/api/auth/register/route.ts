import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  marketingConsent: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Nieprawidłowe dane' }, { status: 400 });

  const { email, name, marketingConsent } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Konto już istnieje — NextAuth wyśle link do istniejącego konta, to OK
    return Response.json({ ok: true });
  }

  await prisma.user.create({
    data: {
      email,
      name,
      marketingConsent,
      marketingConsentAt: marketingConsent ? new Date() : null,
    },
  });

  return Response.json({ ok: true });
}
