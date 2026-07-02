import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({ courseId: z.string().min(1) });

const QUESTIONS_PER_EXAM = 60;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Bad request' }, { status: 400 });

  const { courseId } = parsed.data;

  const course = await prisma.course.findUnique({ where: { slug: courseId } });
  if (!course) return Response.json({ error: 'Course not found' }, { status: 404 });

  // Sprawdź czy user zapłacił
  const payment = await prisma.payment.findFirst({
    where: { userId: session.user.id, courseId: course.id, status: 'SUCCESS' },
  });
  if (!payment) return Response.json({ error: 'Payment required' }, { status: 403 });

  // Sprawdź czy nie ma już aktywnej próby (< 2h od startedAt bez submittedAt)
  const active = await prisma.examAttempt.findFirst({
    where: {
      userId: session.user.id,
      courseId: course.id,
      submittedAt: null,
      startedAt: { gte: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    },
  });
  if (active) return Response.json({ attemptId: active.id });

  // Wylosuj 60 pytań
  const allQuestions = await prisma.examQuestion.findMany({
    where: { courseId: course.id },
    select: { id: true },
  });
  if (allQuestions.length < QUESTIONS_PER_EXAM) {
    return Response.json({ error: 'Not enough questions in bank' }, { status: 503 });
  }

  const selected = shuffle(allQuestions).slice(0, QUESTIONS_PER_EXAM).map((q) => q.id);

  const attempt = await prisma.examAttempt.create({
    data: {
      userId: session.user.id,
      courseId: course.id,
      assignedQuestionIds: JSON.stringify(selected),
      answers: JSON.stringify({}),
      startedAt: new Date(),
    },
  });

  return Response.json({ attemptId: attempt.id });
}
