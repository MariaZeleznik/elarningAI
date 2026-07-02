import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, getAuthor } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog — Neurova AI Academy',
  description: 'Artykuly o AI, Machine Learning i analityce danych od ekspertow Neurova AI Academy',
  openGraph: {
    title: 'Blog Neurova AI Academy',
    description: 'Najnowsze artykuly o AI i analityce danych',
    images: [{ url: '/og-image.svg', width: 1200, height: 630 }],
  },
};

function authorImageFor(tag: string) {
  return tag === 'SQL' || tag === 'Analityka' || tag === 'Python'
    ? '/images/blog-analytics.svg'
    : '/images/blog-ai.svg';
}

export default function BlogPage() {
  const posts = getAllPosts();
  const featured = posts.filter((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-16">
      <header className="mb-10 md:mb-14 text-center">
        <h1 className="font-heading font-bold text-3xl md:text-4xl text-brand-navy mb-3">
          Blog Neurova AI Academy
        </h1>
        <p className="text-brand-muted max-w-xl mx-auto text-base md:text-lg">
          Artykuly, poradniki i case studies o AI, Machine Learning i analityce danych - pisane przez praktyków dla praktyków.
        </p>
      </header>

      {featured.length > 0 && (
        <section className="mb-10 md:mb-14">
          <h2 className="font-heading font-semibold text-sm uppercase tracking-widest text-brand-muted mb-5">
            Polecane
          </h2>
          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {featured.map((post) => {
              const author = getAuthor(post.authorSlug);
              const formatted = new Date(post.date).toLocaleDateString('pl-PL', {
                day: 'numeric', month: 'long', year: 'numeric',
              });
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-white rounded-2xl border border-brand-teal/20 shadow-sm hover:shadow-md transition-all hover:border-brand-teal/40 overflow-hidden"
                >
                  {/* Category illustration */}
                  <div className="overflow-hidden h-36">
                    <Image
                      src={authorImageFor(post.tag)}
                      alt={post.tag}
                      width={600}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5 md:p-6">
                    <div className="flex items-center gap-2 text-xs text-brand-muted mb-3 flex-wrap">
                      <span className="bg-brand-teal/10 text-brand-teal font-semibold px-2.5 py-0.5 rounded-full">
                        {post.tag}
                      </span>
                      <span>·</span>
                      <time dateTime={post.date}>{formatted}</time>
                      <span>·</span>
                      <span>{post.readTime} min czytania</span>
                    </div>
                    <h3 className="font-heading font-bold text-lg md:text-xl text-brand-navy mb-2 group-hover:text-brand-teal transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-brand-muted leading-relaxed mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-3">
                      {author.avatarUrl ? (
                        <Image
                          src={author.avatarUrl}
                          alt={author.name}
                          width={32}
                          height={32}
                          className="rounded-full shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-brand-navy text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {author.avatar}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-brand-navy">{author.name}</p>
                        <p className="text-xs text-brand-muted">{author.role}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-heading font-semibold text-sm uppercase tracking-widest text-brand-muted mb-5">
          Wszystkie artykuly
        </h2>
        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          {rest.map((post) => {
            const author = getAuthor(post.authorSlug);
            const formatted = new Date(post.date).toLocaleDateString('pl-PL', {
              day: 'numeric', month: 'long', year: 'numeric',
            });
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex gap-4 bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-brand-teal/30"
              >
                {/* Mini category image */}
                <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden">
                  <Image
                    src={authorImageFor(post.tag)}
                    alt={post.tag}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-brand-muted mb-1.5 flex-wrap">
                    <span className="bg-brand-teal/10 text-brand-teal font-semibold px-2 py-0.5 rounded-full text-xs">
                      {post.tag}
                    </span>
                    <span>·</span>
                    <time dateTime={post.date}>{formatted}</time>
                  </div>
                  <h3 className="font-heading font-bold text-sm text-brand-navy mb-1 group-hover:text-brand-teal transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      {author.avatarUrl ? (
                        <Image
                          src={author.avatarUrl}
                          alt={author.name}
                          width={20}
                          height={20}
                          className="rounded-full shrink-0"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-brand-navy text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {author.avatar}
                        </div>
                      )}
                      <span className="text-xs text-brand-muted">{author.name}</span>
                    </div>
                    <span className="text-xs text-brand-muted">{post.readTime} min</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
