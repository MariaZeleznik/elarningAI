import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  courseSlug: z.string().min(1),
  lessonSlug: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Bad request' }, { status: 400 });

  const { courseSlug, lessonSlug } = parsed.data;

  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course) return Response.json({ error: 'Course not found' }, { status: 404 });

  await prisma.userProgress.upsert({
    where: { userId_courseId_lessonSlug: { userId: session.user.id, courseId: course.id, lessonSlug } },
    create: { userId: session.user.id, courseId: course.id, lessonSlug, completed: true, completedAt: new Date() },
    update: { completed: true, completedAt: new Date() },
  });

  // Aktualizuj streak
  await prisma.user.update({
    where: { id: session.user.id },
    data: { lastActiveAt: new Date() },
  });

  return Response.json({ ok: true });
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const courseSlug = searchParams.get('courseSlug');
  if (!courseSlug) return Response.json({ error: 'courseSlug required' }, { status: 400 });

  const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
  if (!course) return Response.json({ completed: [] });

  const progress = await prisma.userProgress.findMany({
    where: { userId: session.user.id, courseId: course.id, completed: true },
    select: { lessonSlug: true },
  });

  return Response.json({ completed: progress.map((p) => p.lessonSlug) });
}
