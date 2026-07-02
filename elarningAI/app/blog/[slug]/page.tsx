import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { renderMarkdown } from '@/lib/render-markdown';
import { getAllPosts, getPostBySlug, getPostContent, getAuthor } from '@/lib/blog';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: 'Artykuł nie znaleziony — Blog Neurova AI Academy' };
  const author = getAuthor(post.authorSlug);
  const ogImage = post.tag === 'SQL' || post.tag === 'Analityka' || post.tag === 'Python'
    ? '/images/blog-analytics.svg'
    : '/images/blog-ai.svg';
  return {
    title: `${post.title} — Blog Neurova AI Academy`,
    description: post.excerpt,
    authors: [{ name: author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [author.name],
      images: [{ url: ogImage, width: 800, height: 400, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const content = getPostContent(params.slug);
  const rendered = content ? await renderMarkdown(content) : null;
  const author = getAuthor(post.authorSlug);

  const formatted = new Date(post.date).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: author.name,
      jobTitle: author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Neurova AI Academy',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-14">
        <div className="mb-8">
          <Link href="/blog" className="text-sm text-brand-teal hover:underline font-medium">
            ← Wróć do bloga
          </Link>
        </div>

        {/* Blog hero image */}
        <div className="mb-8 rounded-2xl overflow-hidden">
          <Image
            src={post.tag === 'SQL' || post.tag === 'Analityka' || post.tag === 'Python'
              ? '/images/blog-analytics.svg'
              : '/images/blog-ai.svg'}
            alt={post.title}
            width={800}
            height={400}
            className="w-full h-56 sm:h-72 object-cover"
            priority
          />
        </div>

        <header className="mb-10">
          <div className="flex items-center gap-2 text-xs text-brand-muted mb-4 flex-wrap">
            <span className="bg-brand-teal/10 text-brand-teal font-semibold px-2.5 py-0.5 rounded-full">
              {post.tag}
            </span>
            <span>·</span>
            <time dateTime={post.date}>{formatted}</time>
            <span>·</span>
            <span>{post.readTime} min czytania</span>
          </div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-brand-navy leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-base md:text-lg text-brand-muted leading-relaxed mb-6">{post.excerpt}</p>

          {/* Author row */}
          <div className="flex items-center gap-3 py-4 border-t border-b border-gray-100">
            {author.avatarUrl ? (
              <Image
                src={author.avatarUrl}
                alt={author.name}
                width={40}
                height={40}
                className="rounded-full shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-brand-navy text-white text-sm font-bold flex items-center justify-center shrink-0">
                {author.avatar}
              </div>
            )}
            <div>
              <p className="font-semibold text-brand-navy text-sm">{author.name}</p>
              <p className="text-xs text-brand-muted">{author.role}</p>
            </div>
          </div>
        </header>

        <article className="prose prose-base sm:prose-lg max-w-none break-words [&_pre]:overflow-x-auto [&_table]:block [&_table]:overflow-x-auto [&_table]:max-w-full">
          {rendered ?? <p className="text-brand-muted">Treść artykułu jest w przygotowaniu.</p>}
        </article>

        {/* Author bio */}
        <aside className="mt-16 p-6 bg-gray-50 rounded-2xl border border-gray-200">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted mb-4">
            O autorze
          </p>
          <div className="flex items-start gap-4">
            {author.avatarUrl ? (
              <Image
                src={author.avatarUrl}
                alt={author.name}
                width={56}
                height={56}
                className="rounded-full shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-brand-navy text-white font-bold flex items-center justify-center shrink-0 text-sm">
                {author.avatar}
              </div>
            )}
            <div className="flex-1">
              <p className="font-heading font-bold text-brand-navy">{author.name}</p>
              <p className="text-sm text-brand-teal font-medium mb-2">{author.role}</p>
              <p className="text-sm text-brand-muted leading-relaxed mb-3">{author.bio}</p>
              <div className="flex flex-wrap gap-1.5">
                {author.expertise.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-white border border-gray-200 text-brand-navy px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="mt-8 p-6 bg-brand-teal/5 rounded-2xl border border-brand-teal/20">
          <h3 className="font-heading font-bold text-lg text-brand-navy mb-2">
            Chcesz pogłębić wiedzę?
          </h3>
          <p className="text-brand-muted text-sm mb-4">
            Nasze certyfikowane kursy prowadzą Cię krok po kroku przez świat AI i analityki danych.
          </p>
          <Link
            href="/kursy"
            className="inline-block bg-brand-teal hover:bg-brand-teal/90 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Zobacz kursy →
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/blog" className="text-sm text-brand-muted hover:text-brand-teal transition-colors">
            ← Wszystkie artykuły
          </Link>
        </div>
      </div>
    </>
  );
}
