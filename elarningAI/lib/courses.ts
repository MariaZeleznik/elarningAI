import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const COURSES_DIR = path.join(process.cwd(), 'content/courses');

export interface CourseMeta {
  slug: string;
  title: string;
  description: string;
  priceGrosze: number;
  modules: number;
  author: string;
  authorTitle: string;
}

export interface LessonMeta {
  slug: string;
  courseSlug: string;
  title: string;
  module: number;
  order: number;
  free: boolean;
  duration: number;
}

export interface Exercise {
  prompt: string;
  expected: string;
  hint?: string;
  language?: string;
}

export interface LessonWithContent extends LessonMeta {
  content: string;
  exercise?: Exercise;
}

export function getAllCourses(): CourseMeta[] {
  return fs
    .readdirSync(COURSES_DIR)
    .filter((dir) => fs.statSync(path.join(COURSES_DIR, dir)).isDirectory())
    .map((slug) => {
      const indexPath = path.join(COURSES_DIR, slug, 'index.mdx');
      if (!fs.existsSync(indexPath)) return null;
      const { data } = matter(fs.readFileSync(indexPath, 'utf-8'));
      return { slug, title: data.title, description: data.description, priceGrosze: data.priceGrosze, modules: data.modules, author: data.author, authorTitle: data.authorTitle } as CourseMeta;
    })
    .filter(Boolean) as CourseMeta[];
}

export function getCourse(slug: string): CourseMeta | null {
  const indexPath = path.join(COURSES_DIR, slug, 'index.mdx');
  if (!fs.existsSync(indexPath)) return null;
  const { data } = matter(fs.readFileSync(indexPath, 'utf-8'));
  return { slug, ...data } as CourseMeta;
}

export function getCourseLessons(courseSlug: string): LessonMeta[] {
  const courseDir = path.join(COURSES_DIR, courseSlug);
  if (!fs.existsSync(courseDir)) return [];

  return fs
    .readdirSync(courseDir)
    .filter((f) => f.endsWith('.mdx') && f !== 'index.mdx')
    .map((file) => {
      const slug = file.replace('.mdx', '');
      const { data } = matter(fs.readFileSync(path.join(courseDir, file), 'utf-8'));
      return { slug, courseSlug, title: data.title, module: data.module, order: data.order, free: data.free ?? false, duration: data.duration ?? 20 } as LessonMeta;
    })
    .sort((a, b) => a.order - b.order);
}

export function getLesson(courseSlug: string, lessonSlug: string): LessonWithContent | null {
  const lessonPath = path.join(COURSES_DIR, courseSlug, `${lessonSlug}.mdx`);
  if (!fs.existsSync(lessonPath)) return null;
  const { data, content } = matter(fs.readFileSync(lessonPath, 'utf-8'));
  return {
    slug: lessonSlug,
    courseSlug,
    title: data.title,
    module: data.module,
    order: data.order,
    free: data.free ?? false,
    duration: data.duration ?? 20,
    content,
    exercise: data.exercise ?? undefined,
  } as LessonWithContent;
}
