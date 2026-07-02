import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({ attemptId: z.string().min(1) });

const PASS_THRESHOLD = 0.7;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Bad request' }, { status: 400 });

  const { attemptId } = parsed.data;

  const attempt = await prisma.examAttempt.findFirst({
    where: { id: attemptId, userId: session.user.id, submittedAt: null },
  });
  if (!attempt) return Response.json({ error: 'Attempt not found or already submitted' }, { status: 404 });

  const assignedIds: string[] = JSON.parse(attempt.assignedQuestionIds);
  const answers: Record<string, string> = JSON.parse(attempt.answers);

  const questions = await prisma.examQuestion.findMany({
    where: { id: { in: assignedIds } },
    select: { id: true, correctOption: true },
  });

  let correct = 0;
  for (const q of questions) {
    if (answers[q.id] === q.correctOption) correct++;
  }

  const score = Math.round((correct / assignedIds.length) * 100);
  const passed = score / 100 >= PASS_THRESHOLD;

  const updated = await prisma.examAttempt.update({
    where: { id: attemptId },
    data: { score, passed, submittedAt: new Date() },
  });

  if (passed) {
    await prisma.certificate.upsert({
      where: { userId_courseId: { userId: session.user.id, courseId: attempt.courseId } },
      create: { userId: session.user.id, courseId: attempt.courseId, issuedAt: new Date() },
      update: {},
    });
  }

  const certificate = passed
    ? await prisma.certificate.findUnique({
        where: { userId_courseId: { userId: session.user.id, courseId: attempt.courseId } },
      })
    : null;

  return Response.json({ score, passed, correct, total: assignedIds.length, certificateId: certificate?.id ?? null });
}
