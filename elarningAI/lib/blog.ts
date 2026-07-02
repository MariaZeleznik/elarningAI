import fs from 'fs';
import path from 'path';

export type Author = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  avatar: string; // initials fallback
  avatarUrl?: string;
  expertise: string[];
  linkedinUrl?: string;
};

export type PostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: number;
  tag: string;
  authorSlug: string;
  featured?: boolean;
};

export const authors: Record<string, Author> = {
  'marta-kowalska': {
    slug: 'marta-kowalska',
    name: 'Marta Kowalska',
    role: 'ML Research Engineer',
    bio: 'ML Engineer z kilkuletnim doświadczeniem badawczym i produkcyjnym. Specjalizuje się w architekturach transformerów, systemach RAG i wdrożeniach LLM w produkcji. Kontrybutorka projektów open-source w ekosystemie Hugging Face.',
    avatar: 'MK',
    avatarUrl: '/authors/marta-kowalska.svg',
    expertise: ['LLM', 'Deep Learning', 'MLOps', 'RAG', 'Transformery'],
  },
  'marek-wisnewski': {
    slug: 'marek-wisnewski',
    name: 'Marek Wiśniewski',
    role: 'Senior Data Analyst & Konsultant',
    bio: '14 lat w analityce danych - od Excela przez SQL do Pythona. Konsultant dla firm z sektorów e-commerce, fintech i retail. Prowadzi projekty Data Mesh, wdraża dbt i ClickHouse. Wierzy, że dobry SQL jest sztuką, a zły - katastrofą.',
    avatar: 'MW',
    avatarUrl: '/authors/marek-wisnewski.svg',
    expertise: ['SQL', 'Python', 'dbt', 'Power BI', 'Data Mesh', 'BI Architecture'],
  },
};

export const posts: PostMeta[] = [
  // Marta Kowalska — AI/ML
  {
    slug: 'jak-dziala-chatgpt-architektura-transformerow',
    title: 'Jak działa ChatGPT? Architektura transformerów dla praktyków',
    excerpt: 'Attention is all you need — ale co to naprawdę znaczy? Rozkładam architekturę transformerów na czynniki pierwsze bez zbędnej matematyki.',
    date: '2025-02-10',
    readTime: 14,
    tag: 'AI',
    authorSlug: 'marta-kowalska',
    featured: true,
  },
  {
    slug: 'fine-tuning-vs-rag-kiedy-co-wybrac',
    title: 'Fine-tuning vs RAG — kiedy dostraić model, a kiedy zbudować wyszukiwarkę?',
    excerpt: 'Dwa najpopularniejsze podejścia do adaptacji LLM. Które jest lepsze? Odpowiedź (jak zwykle) zależy — ale pokażę Ci jak to ocenić.',
    date: '2025-04-08',
    readTime: 11,
    tag: 'AI',
    authorSlug: 'marta-kowalska',
  },
  {
    slug: 'llm-w-biznesie-praktyczny-przewodnik',
    title: 'LLM w biznesie — jak wdrożyć model językowy bez milionowego budżetu',
    excerpt: 'Praktyczny przewodnik po wdrożeniu LLM w organizacji. Od wyboru modelu, przez ewaluację, po monitoring w produkcji.',
    date: '2025-06-03',
    readTime: 16,
    tag: 'AI',
    authorSlug: 'marta-kowalska',
  },
  {
    slug: 'ewaluacja-modeli-llm-jak-mierzyc',
    title: 'Ewaluacja modeli LLM — jak mierzyć to, czego nie widać?',
    excerpt: 'Accuracy to za mało. Pokazuję, jak zbudować pipeline ewaluacyjny dla LLM: od benchmarków po własne datasety testowe.',
    date: '2025-08-19',
    readTime: 13,
    tag: 'AI',
    authorSlug: 'marta-kowalska',
  },
  {
    slug: 'prompt-engineering-chain-of-thought-structured-output',
    title: 'Prompt engineering w 2025 — chain-of-thought, few-shot i structured outputs',
    excerpt: 'Prompt engineering to nie magia — to inżynieria. Pokazuję techniki, które faktycznie działają w produkcji.',
    date: '2025-10-14',
    readTime: 12,
    tag: 'AI',
    authorSlug: 'marta-kowalska',
  },
  {
    slug: 'agenci-ai-co-to-jest-i-kiedy-uzywac',
    title: 'Agenci AI — co to naprawdę jest i kiedy ma to sens?',
    excerpt: '"Agent AI" stał się słowem-wytrąchem. Wyjaśniam architekturę, realne przypadki użycia i kiedy agent to przerost formy nad treścią.',
    date: '2025-12-02',
    readTime: 15,
    tag: 'AI',
    authorSlug: 'marta-kowalska',
  },
  {
    slug: 'trendy-ai-2026-co-sie-dzieje',
    title: 'Trendy AI w 2026 — co się naprawdę dzieje poza hype\'em',
    excerpt: 'Multimodalne modele, reasoning, agenci i synteza danych. Które trendy są substancją, a które szumem? Moja ocena po roku obserwacji.',
    date: '2026-01-20',
    readTime: 13,
    tag: 'AI',
    authorSlug: 'marta-kowalska',
    featured: true,
  },
  {
    slug: 'rag-krok-po-kroku-asystent-na-dokumentach',
    title: 'RAG krok po kroku — zbuduj asystenta AI na własnych dokumentach',
    excerpt: 'Retrieval-Augmented Generation od podstaw: chunking, embeddingi, vector store, ranking. Pełny tutorial z kodem.',
    date: '2026-04-07',
    readTime: 18,
    tag: 'AI',
    authorSlug: 'marta-kowalska',
  },

  // Marek Wiśniewski — Data Analytics
  {
    slug: 'sql-vs-python-co-wybrac',
    title: 'SQL vs Python — powiedzmy sobie wprost',
    excerpt: 'Po 14 latach w analityce mam jedno zdanie na ten temat. Nie jest to "zależy" — to konkretna rekomendacja z wyjaśnieniem.',
    date: '2025-05-06',
    readTime: 9,
    tag: 'SQL',
    authorSlug: 'marek-wisnewski',
  },
  {
    slug: 'przyszlosc-analityki-danych-2025',
    title: 'Analityka danych w 2025 — co się naprawdę zmienia',
    excerpt: 'Nie piszę o trendach z raportu Gartnera. Piszę o tym, co widzę u klientów i co faktycznie robi różnicę w pracy analityka.',
    date: '2025-07-14',
    readTime: 11,
    tag: 'Analityka',
    authorSlug: 'marek-wisnewski',
    featured: true,
  },
  {
    slug: 'sql-window-functions-10-przypadkow',
    title: 'SQL Window Functions — 10 przypadków, które zmieniają sposób pisania zapytań',
    excerpt: 'Window functions to najbardziej niedoceniana funkcjonalność SQL. Pokazuję 10 realnych scenariuszy z projektów klientów.',
    date: '2025-09-09',
    readTime: 14,
    tag: 'SQL',
    authorSlug: 'marek-wisnewski',
  },
  {
    slug: 'dbt-dlaczego-kazdy-analityk-powinien-znac',
    title: 'dbt — dlaczego każdy analityk danych powinien to znać w 2025',
    excerpt: 'dbt to nie hype. To narzędzie, które przez ostatnie 4 lata zmieniło sposób pracy z danymi w setce firm, z którymi współpracowałem.',
    date: '2025-11-18',
    readTime: 12,
    tag: 'Analityka',
    authorSlug: 'marek-wisnewski',
  },
  {
    slug: 'data-storytelling-jak-opowiadac-przez-dane',
    title: 'Data storytelling — dlaczego twoje wykresy nie przekonują nikogo',
    excerpt: 'Masz dane, masz insighty, masz Tableau. Ale zarząd i tak idzie na przeczucie. Problem nie jest w danych — jest w narracji.',
    date: '2026-02-03',
    readTime: 10,
    tag: 'Analityka',
    authorSlug: 'marek-wisnewski',
  },
  {
    slug: 'python-polars-vs-pandas-2026',
    title: 'Python Polars vs pandas — czy warto zmieniać nawyki w 2026?',
    excerpt: 'Polars robi furorę. Przetestowałem go na realnych projektach. Moja szczera ocena — kiedy warto, a kiedy pandas nadal wygrywa.',
    date: '2026-03-25',
    readTime: 11,
    tag: 'Python',
    authorSlug: 'marek-wisnewski',
  },
  {
    slug: 'hurtownie-danych-2026-snowflake-bigquery-duckdb',
    title: 'Hurtownie danych w 2026 — Snowflake, BigQuery czy DuckDB?',
    excerpt: 'Rynek platform danych zmienił się bardziej w ostatnich 2 latach niż w poprzedniej dekadzie. Gdzie powinny trafiać Twoje dane?',
    date: '2026-05-12',
    readTime: 13,
    tag: 'Analityka',
    authorSlug: 'marek-wisnewski',
  },
];

export function getAllPosts(): PostMeta[] {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): PostMeta | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPostContent(slug: string): string {
  const filePath = path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return '';
  return fs.readFileSync(filePath, 'utf-8');
}

export function getAuthor(slug: string): Author {
  return authors[slug] ?? authors['marta-kowalska'];
}
