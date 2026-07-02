import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  attemptId: z.string().min(1),
  questionId: z.string().min(1),
  answer: z.enum(['A', 'B', 'C', 'D']),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Bad request' }, { status: 400 });

  const { attemptId, questionId, answer } = parsed.data;

  const attempt = await prisma.examAttempt.findFirst({
    where: { id: attemptId, userId: session.user.id, submittedAt: null },
  });
  if (!attempt) return Response.json({ error: 'Attempt not found or already submitted' }, { status: 404 });

  const assignedIds: string[] = JSON.parse(attempt.assignedQuestionIds);
  if (!assignedIds.includes(questionId)) {
    return Response.json({ error: 'Question not in this attempt' }, { status: 400 });
  }

  const currentAnswers: Record<string, string> = JSON.parse(attempt.answers);
  currentAnswers[questionId] = answer;

  await prisma.examAttempt.update({
    where: { id: attemptId },
    data: { answers: JSON.stringify(currentAnswers) },
  });

  return Response.json({ ok: true });
}
