import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getCourse } from '@/lib/courses';
import { prisma } from '@/lib/prisma';
import { ExamRunner } from './exam-runner';

interface Props { params: { courseId: string } }

export const metadata = { title: 'Egzamin certyfikacyjny', robots: { index: false } };

export default async function ExamPage({ params }: Props) {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch { /* treat as unauthenticated */ }
  if (!session) redirect(`/logowanie?callbackUrl=/egzamin/${params.courseId}`);

  const course = getCourse(params.courseId);
  if (!course) notFound();

  const courseRecord = await prisma.course.findUnique({ where: { slug: params.courseId } });
  if (!courseRecord) notFound();

  const payment = await prisma.payment.findFirst({
    where: { userId: session.user.id, courseId: courseRecord.id, status: 'SUCCESS' },
  });
  if (!payment) redirect(`/egzamin/${params.courseId}/platnosc`);

  // Istniejąca aktywna próba lub undefined
  const activeAttempt = await prisma.examAttempt.findFirst({
    where: {
      userId: session.user.id,
      courseId: courseRecord.id,
      submittedAt: null,
      startedAt: { gte: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    },
  });

  let questions: Array<{ id: string; text: string; optionA: string; optionB: string; optionC: string; optionD: string }> = [];
  let attemptId: string | null = null;
  let existingAnswers: Record<string, string> = {};

  if (activeAttempt) {
    attemptId = activeAttempt.id;
    const ids: string[] = JSON.parse(activeAttempt.assignedQuestionIds);
    existingAnswers = JSON.parse(activeAttempt.answers);
    questions = await prisma.examQuestion.findMany({
      where: { id: { in: ids } },
      select: { id: true, text: true, optionA: true, optionB: true, optionC: true, optionD: true },
      orderBy: { id: 'asc' },
    });
    // Przywróć kolejność z assignedQuestionIds
    const map = new Map(questions.map((q) => [q.id, q]));
    questions = ids.map((id) => map.get(id)!).filter(Boolean);
  }

  return (
    <ExamRunner
      courseId={params.courseId}
      courseTitle={course.title}
      initialAttemptId={attemptId}
      initialQuestions={questions}
      initialAnswers={existingAnswers}
    />
  );
}
