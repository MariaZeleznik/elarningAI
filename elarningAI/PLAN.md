# Neurova AI Academy — Platforma E-learning

## Context

Budujemy polskojęzyczną platformę e-learningową **Neurova AI Academy** skierowaną do Polaków wchodzących na rynek pracy lub zmieniających branżę na AI i analitykę danych. Platforma startuje lokalnie (Docker), następnie jest wdrażana produkcyjnie. Główne wyzwania: duża konkurencja + marka bez "kurs AI" w nazwie → SEO content cluster jako priorytet; GDPR/RODO jako twardy wymóg; certyfikaty jako główny differentiator i model monetyzacji.

---

## 1. Marka i Domena

**Marka: Neurova AI Academy**
- Znak handlowy: **Neurova**
- Domena: **`neurova.pl`** ✅ (dostępna — potwierdzone przez właściciela)
- Subdomena e-mail: `noreply@neurova.pl`, `kontakt@neurova.pl`
- Logo: "N" stylizowane jako synaps neuronowy / węzeł sieci neuronowej (AI-first vizual)

**Wyzwanie SEO**: Marka "Neurova" nie zawiera słów kluczowych ("kurs AI", "analityka danych"). Rozwiązanie → SEO Content Cluster (sekcja 2a).

---

## 2. Brand Identity

### Archetyp: Mędrzec (The Sage) z elementami Bohatera (The Hero)

- **Target**: Polacy 22–42 lat, wchodzący na rynek pracy lub przebranżawiający się
- **Mędrzec** → "Damy Ci wiedzę, której potrzebujesz" – zaufanie, autorytet, pewność
- **Bohater** → "Możesz to zrobić, zdobądź certyfikat" – motywacja, przełamanie bariery wejścia

### Paleta kolorów

| Rola | Kolor | Hex |
|---|---|---|
| Primary | Navy Blue | `#1B2E4B` |
| Secondary | Gold/Amber | `#C9A94B` |
| Accent | Teal | `#00A896` |
| Background | Light Gray | `#F8F9FA` |
| Text | Dark | `#1A1A2E` |
| Text muted | Gray | `#64748B` |

### Typography

Wszystkie trzy czcionki posiadają licencje darmowe dla użytku komercyjnego:

| Czcionka | Licencja | Użycie | Status komercyjny |
|---|---|---|---|
| **Plus Jakarta Sans** | SIL Open Font License 1.1 | Headings | ✅ Darmowa komercyjnie |
| **Inter** | SIL Open Font License 1.1 | Body text | ✅ Darmowa komercyjnie |
| **JetBrains Mono** | Apache License 2.0 | Kod/monospace | ✅ Darmowa komercyjnie |

SIL OFL 1.1 i Apache 2.0 pozwalają na bezpłatne użycie komercyjne, modyfikacje i dystrybucję. Hosted via Google Fonts (self-host dla wydajności i privacy: `next/font/google` z `display: swap`).

### Obrazy
- W 100% generowane AI (Midjourney lub DALL-E 3)
- Konwersja do **WebP** (compress + next/image)
- Lazy loading domyślny w Next.js
- Alt text po polsku (SEO + accessibility)

---

## 3. Tech Stack

### Core
| Warstwa | Technologia | Uzasadnienie |
|---|---|---|
| Framework | **Next.js 14+ (App Router)** | SSR/SSG dla SEO, RSC, API routes |
| Language | **TypeScript** | Bezpieczeństwo typów, mniej bugów |
| Styling | **Tailwind CSS + shadcn/ui** | Szybki DX + WCAG 2.1 accessibility |
| ORM | **Prisma + PostgreSQL** | Relacyjna DB, type-safe queries |
| Cache | **Redis (Upstash)** | Session management, rate limiting |
| Auth | **NextAuth.js v5** | Google, email/password, JWT |

### Content
- **MDX** (Markdown + JSX) — treści kursów w `/content/courses/`
- **Contentlayer** — type-safe MDX processing, hot reload
- Wersjonowanie treści przez **Git** (każda zmiana = commit)

### Mailing
- **Brevo** (formerly Sendinblue): EU-based, natywna zgodność z GDPR
  - Transakcyjne (rejestracja, reset hasła, certyfikat) + Marketing (newsletter)
  - Free tier: unlimited contacts, 300 emails/dzień / 9000/miesiąc
  - Double opt-in, 1-click unsubscribe, consent management wbudowany
  - SDK: `@getbrevo/brevo` dla Node.js/Next.js

### Analytics Ruchu
- **Umami** (self-hosted): rekomendacja główna
  - Free: deployowany na tym samym Vercel + Supabase
  - No cookies → brak potrzeby consent banner dla analytics
  - GDPR-compliant by default, dane zostają w EU
  - Alternatywa: **Plausible** (~$9/mies, EU-hosted, zero-config)
  - **Odrzucamy GA4**: wymaga cookie consent, DPA z Google, transfer do USA

### Płatności
- **Przelewy24** (primary): dedykowany do polskiego rynku
  - BLIK: ~0.8% per transakcja (najtańszy dla polskich użytkowników)
  - Bank transfer: ~1.49% + 0.19 PLN per transakcja
  - Karty: stawka zależy od umowy z P24
  - Sandbox środowisko: https://sandbox.przelewy24.pl (dev/testing bez realnych opłat)
  - SDK: `przelewy24` npm package + webhook weryfikacja podpisu
  - VAT/faktury: integracja z systemem fakturowania (np. InFakt API lub manualna)
- Stripe odrzucony jako droższy dla docelowego rynku polskiego

### Środowisko testowe (mock payments)
- Dev: `PAYMENT_MODE=sandbox` → Przelewy24 Sandbox (pełny flow UI bez realnych opłat)
- `PAYMENT_MODE=mock` → pomija Przelewy24 całkowicie, symuluje sukces po kliknięciu "Zapłać"
- Playwright testy: zawsze `PAYMENT_MODE=mock`
- Staging: `PAYMENT_MODE=sandbox`
- Produkcja: `PAYMENT_MODE=live`

### Certyfikaty
- **@react-pdf/renderer** — generowanie PDF
- UUID per certyfikat, QR code → publiczna strona weryfikacji
- LinkedIn deep link: `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&...`

### Weekly Content Updates
- **node-cron** (local dev) / **Vercel Cron Jobs** (prod)
- Hybryda: blog/SEO articles → auto-publish | treści kursów + pytania egzaminacyjne → admin panel do weryfikacji
- Szczegóły w sekcji 10 poniżej

### Testing
- **Playwright** — E2E / automated user story tests
- **Jest + React Testing Library** — unit / integration
- **MSW** — mock API w testach

### SEO Tools
- `next-sitemap` — auto sitemap.xml
- `next-seo` — meta tags management
- JSON-LD structured data (inline, per page)

### Deployment
| Środowisko | Stack |
|---|---|
| **Lokalnie (dev/test)** | Docker Compose: Next.js + PostgreSQL + Redis |
| **Produkcja** | **Vercel** (Next.js) + **Supabase** (PostgreSQL, EU Frankfurt) + **Upstash** (Redis) |

---

## 4. Architektura Aplikacji

```
/
├── app/
│   ├── (marketing)/              # Public pages
│   │   ├── page.tsx              # Landing page (SEO hero)
│   │   ├── kursy/page.tsx        # Course catalog
│   │   └── o-nas/page.tsx
│   ├── (auth)/
│   │   ├── logowanie/page.tsx
│   │   ├── rejestracja/page.tsx
│   │   └── reset-hasla/page.tsx
│   ├── (dashboard)/              # Protected routes
│   │   ├── panel/page.tsx        # User dashboard
│   │   ├── certyfikaty/page.tsx
│   │   └── postep/page.tsx
│   ├── kursy/[slug]/
│   │   ├── page.tsx              # Course overview
│   │   └── [lesson]/page.tsx     # Lesson player
│   ├── egzamin/[courseId]/
│   │   ├── page.tsx              # Exam flow
│   │   └── platnosc/page.tsx     # Stripe checkout
│   ├── certyfikat/[id]/page.tsx  # Public cert verification
│   ├── admin/                    # Admin panel
│   │   ├── dashboard/
│   │   └── aktualizacje/         # Content update review
│   └── api/
│       ├── auth/[...nextauth]/
│       ├── progress/
│       ├── certificates/
│       ├── payment/              # Stripe webhooks
│       └── cron/content-update/
├── content/
│   └── courses/
│       ├── analityka-danych/     # 12 MDX files
│       └── ai-machine-learning/  # 12 MDX files
├── components/
│   ├── certificate/CertificatePDF.tsx
│   ├── course/LessonPlayer.tsx
│   ├── exam/ExamRunner.tsx
│   └── ui/                      # shadcn components
├── lib/
│   ├── cron/contentUpdate.ts
│   ├── payment.ts              # Przelewy24 client + mock adapter
│   ├── auth.ts
│   └── pdf.ts
└── prisma/
    └── schema.prisma
```

### Prisma Schema (kluczowe modele)
```
User, Course, Lesson, UserProgress, Exam, ExamQuestion, 
ExamAttempt, Certificate, Payment, ContentUpdateLog
```

---

## 5. Program Kursów

### Kurs 1: Analityka Danych (12 modułów)

| # | Moduł | Kluczowe tematy |
|---|---|---|
| 1 | Podstawy analizy danych | Rodzaje danych, cykl życia, narzędzia rynkowe |
| 2 | SQL dla analityków | SELECT..JOIN..GROUP BY, window functions, subqueries, optymalizacja |
| 3 | Excel w analizie | Formuły zaawansowane, tabele przestawne, Power Query |
| 4 | Python dla analityków | pandas, NumPy, EDA, matplotlib |
| 5 | Statystyka | Statystyka opisowa, wnioskowanie, testy hipotez, A/B testing |
| **6** | **Wizualizacja i Projektowanie Dashboardów** | *Patrz niżej* |
| 7 | Power BI | Modele danych, DAX, publikowanie, dashboardy |
| 8 | Google Analytics i GA4 | Metryki, lejki, UTM, raporty |
| 9 | Business Intelligence | ETL/ELT, hurtownie danych, Star Schema |
| 10 | Data Storytelling | Narracja danych, prezentacje dla stakeholderów |
| 11 | Zaawansowana analityka | Prognozowanie, regresja, scenariusze |
| 12 | Projekt końcowy | Case study + przygotowanie do egzaminu |

#### Moduł 6: Wizualizacja i Projektowanie Dashboardów (rozszerzona)

> 📌 **Uwaga dla implementacji**: Metody omawiane w tym module wywodzą się z uznanych zasad projektowania informacji. Imię i nazwisko autora metodyki **NIE pojawia się na stronach publicznych** neurova.pl (brak zgody na promocję). W repo i materiałach wewnętrznych: pełna atrybucja w porządku. Na platformie: opisujemy metody bez atrybucji personalnej.

- **Zasady projektowania tabel i wykresów**: kiedy tabela, kiedy wykres, jak oba łączyć
- **8 zasad efektywnej wizualizacji**: accuracy (precyzja), clarity (jasność), efficiency (efektywność), aesthetics (estetyka)
- Dobór typu wykresu: kiedy bar, kiedy line, nigdy pie (i dlaczego — percepcja kątów vs. długości)
- **Gestalt principles** w dataviz (proximity, similarity, continuity, closure)
- Eliminacja "chart junk": dekoracje vs. informacja
- **Projektowanie dashboardów**: koncepcja, layout, density, hierarchia informacji
- Praktyka w Power BI i Python (matplotlib/seaborn z principle-based settings)

### Kurs 2: Sztuczna Inteligencja i Machine Learning (12 modułów)

| # | Moduł | Kluczowe tematy |
|---|---|---|
| 1 | Wprowadzenie do AI/ML | Historia, rodzaje ML, terminologia, ekosystem Python |
| 2 | Matematyczne podstawy | Algebra liniowa, prawdopodobieństwo, calculus w ML |
| 3 | Python dla ML | scikit-learn, przygotowanie danych, feature engineering |
| 4 | Klasyczne algorytmy | Regresja, klasyfikacja, clustering, drzewa decyzyjne |
| 5 | Ensemble methods | Random Forest, XGBoost, LightGBM, stacking |
| 6 | Deep Learning | Sieci neuronowe, CNN, LSTM, backpropagation, TensorFlow/PyTorch |
| 7 | NLP | Tokenizacja, embeddings, sentiment analysis, NER, spaCy |
| 8 | Generatywna AI i LLM | Transformer architecture, prompt engineering, Anthropic/OpenAI API, Hugging Face, RAG |
| 9 | Computer Vision | CNN deep dive, transfer learning, object detection |
| 10 | MLOps | Docker, MLflow, DVC, CI/CD dla ML, monitoring modeli w produkcji |
| 11 | Etyka AI i regulacje | EU AI Act, bias & fairness, XAI (explainability), odpowiedzialne AI |
| 12 | Projekt końcowy | Case study + przygotowanie do egzaminu |

---

## 6. Model Monetyzacji

### Weryfikacja: Darmowe materiały + płatny egzamin ✅ REKOMENDOWANE

**Uzasadnienie marketingowe:**
- Model stosowany przez: Anthropic, Google Cloud, AWS, Coursera Audit
- Niski próg wejścia → wysoka konwersja do użytkowników → monetyzacja przez certyfikat (który ma realną wartość na rynku pracy)
- Dla polskiego rynku: career-changerzy mogą "spróbować bez ryzyka" → buduje zaufanie
- Certyfikat na LinkedIn = wirusowy marketing platformy (każdy certyfikat = darmowa reklama)
- **Ceny egzaminów (ustalone):**
  - Kurs Analityki Danych: **249 PLN** za jedno podejście
  - Kurs AI i Machine Learning: **349 PLN** za jedno podejście
  - Ceny konfigurowalne w panelu admin (bez zmiany kodu)

**Procesor płatności: Przelewy24 (primary)**
- Tańszy dla polskiego rynku niż Stripe
- BLIK (~0.8%), przelew bankowy, karty — wszystkie polskie metody
- Sandbox środowisko do testów (pełny UI bez realnych opłat)
- Webhook podpis: weryfikacja `CRC` hash per każde żądanie
- Integracja z systemem fakturowania dla B2C

---

## 7. Certyfikaty

### Logo na wszystkich materiałach — zasada spójności

Logo Neurova AI Academy (plik SVG + WebP) pojawia się w każdym punkcie styku z użytkownikiem:

| Materiał | Lokalizacja logo | Format |
|---|---|---|
| **Certyfikat PDF** | Górny lewy róg + watermark w tle | SVG w @react-pdf/renderer |
| **Publiczna strona certyfikatu** (`/certyfikat/[uuid]`) | Header, og:image | WebP |
| **Email transakcyjny** (certyfikat w załączniku) | Header emaila, stopka | Hostowany PNG (Brevo) |
| **Lekcje kursu** (lesson player) | Sticky header, mobile top bar | SVG w Next.js |
| **Materiały do pobrania** (PDFy ćwiczeń, datasety) | Nagłówek/stopka każdego pliku | SVG |
| **PWA splash screen** | Ładowanie aplikacji | PNG 512×512 |
| **OG images** (Social media preview) | Prawy górny lub dolny prawy | Osadzony w szablonie |

**Implementacja w kodzie** — jeden eksportowany komponent:
```typescript
// components/brand/Logo.tsx — jedyne źródło logo w całej aplikacji
// components/certificate/CertificatePDF.tsx — importuje Logo + nakłada na PDF
// public/og-template.png — bazowy szablon Open Graph z logo wbudowanym
// public/icons/ — manifest PWA (icon-192.png, icon-512.png)
```

### Mechanizm
1. Użytkownik zalicza egzamin (próg: **70%** lub wyżej, TBD)
2. System generuje certyfikat z:
   - Imię i nazwisko (z profilu)
   - Nazwa kursu i data
   - Unikalny UUID + QR code → publiczna strona weryfikacji
   - **Logo Neurova AI Academy** (górny lewy róg) + watermark "Neurova" w tle
   - Podpis właściciela
3. Certyfikat dostępny w panelu użytkownika
4. **Pobieranie PDF**: `@react-pdf/renderer`
5. **LinkedIn deep link**:
   ```
   https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME
   &name=Certyfikat Analityki Danych
   &organizationId=[ID]
   &issueYear=YYYY&issueMonth=MM
   &certUrl=https://akademiadanych.pl/certyfikat/[UUID]
   &certId=[UUID]
   ```
6. **Publiczna strona weryfikacji** `/certyfikat/[UUID]` — bez logowania, dostępna dla rekruterów

---

## 2a. SEO Content Cluster — Strategia 3–6 miesięcy

**Problem**: "Neurova" nie rankuje na "kurs AI", "analityka danych" — brand nowy, zero autorytetu.
**Rozwiązanie**: Hub & Spoke content cluster wokół intencji zakupowych career-changerów.

### Struktura klastra (Hub)

```
neurova.pl/blog/                    ← Blog hub (AI-SEO + Google)
├── /jak-zostac-analitykiem-danych  ← Pillar page #1 (3000+ słów)
├── /jak-zostac-ai-engineerem       ← Pillar page #2 (3000+ słów)
├── /przebranzoiwenie-na-it-poradnik ← Pillar page #3 (career changers)
└── /zarobki-analityk-danych-polska ← Pillar page #4 (salary intent)

Spoke articles (po 1500+ słów każdy):
/blog/sql-dla-poczatkujacych
/blog/python-data-analysis-tutorial
/blog/power-bi-vs-tableau-porownanie
/blog/machine-learning-co-to-jest
/blog/prompt-engineering-przewodnik
/blog/mlops-co-to-jest
/blog/certyfikat-ai-czy-warto
/blog/portfoilo-analityk-danych [itd.]
```

### Plan 3–6 miesięcy

| Miesiąc | Działania | Cel |
|---|---|---|
| 1 | 4 Pillar pages + techniczny SEO (schema, sitemap, speed) | Indeksacja w Google |
| 2 | 8 Spoke articles + internal linking | Pierwsze pozycje long-tail |
| 3 | FAQ pages, Glossary, 4 nowe spokes | Top 10 na branded terms |
| 4 | Case studies, "Porównanie kursów AI", user testimonials | E-E-A-T authority |
| 5–6 | Link building (wymiana, PR), Guest posts na polskich IT blogach | Pierwsze leady organiczne |

### Keyword targeting — Analityka Danych (przebranzowienie/kariera)
- "jak zostać analitykiem danych" — high volume, high career intent
- "kurs analityki danych po polsku" — bezpośredni intent zakupowy
- "certyfikat analityk danych Polska" — certyfikat intent
- "zarobki analityk danych Polska 2025" — research → pipeline do produktu
- "Python dla nie-programistów" — low competition, high conversion
- "przebranzowienie na IT bez doświadczenia" — emotional intent career-changers
- "SQL kurs od zera po polsku" — entry-level, high volume
- "Power BI kurs po polsku" — narzędziowy, duże wyszukiwanie
- "jak czytać dashboardy Power BI" — long-tail, niskie competition

### Keyword targeting — AI / Machine Learning (priorytet — rozbudowane)
- "kurs sztucznej inteligencji po polsku" — high volume, top AI keyword PL
- "kurs machine learning po polsku" — bezpośredni zakupowy
- "jak nauczyć się AI od zera" — entry-level, ogromny potencjał
- "jak zostać AI engineerem w Polsce" — career intent, rosnące wyszukiwanie
- "ChatGPT dla biznesu kurs" — trending, wysoka komercyjność
- "prompt engineering tutorial po polsku" — skill-based, rosnący trend
- "LLM kurs po polsku" — techniczny, niszowy ale duże intent
- "generatywna AI kurs" — emerging, coraz więcej wyszukiwań
- "sztuczna inteligencja kurs dla początkujących" — broad match, high volume
- "deep learning kurs po polsku" — technical audience
- "certyfikat machine learning Polska" — certyfikat intent AI-specific
- "automatyzacja z AI Polska" — B2B + career changers
- "RAG retrieval augmented generation tutorial PL" — ultra-niszowy, high-quality lead
- "AI w pracy jak zacząć" — broad, emotional intent zmiany zawodowej
- "co to jest LLM prosty opis" — definicja intent → AI Overviews target
- "neural network kurs po polsku" — education intent
- "OpenAI API tutorial po polsku" — developer-technical niche
- "Hugging Face tutorial po polsku" — ML practitioners
- "MLOps co to jest po polsku" — definition + career intent

### Długi ogon (long-tail — AI-SEO dla AI Overviews)
- "różnica między AI a machine learning" — question intent, Perplexity/ChatGPT target
- "jak AI zmienia rynek pracy w Polsce" — trending, emotional career relevance
- "czy warto uczyć się AI w 2025" — decision intent, high conversion
- "jakich umiejętności AI szuka pracodawca w Polsce" — job-seeker intent

---

## 8. SEO & AI-SEO (Polska — Pełna Weryfikacja Wytycznych)

### Technical SEO — Kompletna Lista

| Wymaganie | Status | Implementacja |
|---|---|---|
| SSR/SSG | ✅ | Next.js App Router (SSR dla dynamicznych, SSG dla statycznych) |
| `<html lang="pl">` | ✅ | `layout.tsx`: `<html lang="pl">` |
| `hreflang="pl"` | ✅ | Next.js Metadata API |
| Canonical URLs | ✅ | `alternates.canonical` per strona |
| sitemap.xml | ✅ | `next-sitemap` — dynamiczny, kursy + blog + cert |
| robots.txt | ✅ | `noindex`: /admin/*, /api/*, /dashboard/* |
| Core Web Vitals | ✅ | LCP < 2.5s, CLS < 0.1, INP < 200ms — **PageSpeed mobile: 99%** (iteruj do osiągnięcia, blokuje deploy) |
| HTTPS only | ✅ | Vercel + HSTS header |
| Mobile-first indexing | ✅ | Mobile-first design (sekcja 10b) |
| Page speed (Google) | ✅ | WebP images, font self-hosting, code splitting → cel: **99% mobile PageSpeed** (patrz sekcja 18) |
| **URL slugs (PL)** | ✅ | Lowercase, bez polskich znaków diakrytycznych, myślniki |
| **Open Graph** | ✅ | og:title, og:description, og:image, og:locale=pl_PL |
| **Twitter/X Cards** | ✅ | twitter:card=summary_large_image, twitter:title |
| **Meta description** | ✅ | 150–160 znaków, unikalna per strona |
| **Page titles** | ✅ | Format: "Tytuł Strony \| Neurova AI Academy" |
| **Breadcrumbs** | ✅ | `BreadcrumbList` JSON-LD + `<nav aria-label="Breadcrumb">` |
| **noindex dla stron prywatnych** | ✅ | Dashboard, profil, egzamin, certyfikaty (zalogowani only) |
| **Canonical dla params** | ✅ | `?page=2`, `?sort=` → rel=canonical na bazowy URL |
| **Alt text obrazów** | ✅ | Po polsku, opisowy, bez "image of" |
| **Google Search Console** | ⏳ | Weryfikacja po deploymencie neurova.pl |

### URL Slug Konwencja (Polska)

```
✅ Prawidłowe:
/kursy/analityka-danych
/kursy/ai-machine-learning
/kursy/analityka-danych/sql-dla-analitykow
/blog/jak-zostac-analitykiem-danych
/blog/kurs-machine-learning-po-polsku
/certyfikat/[uuid]

❌ Błędne:
/kursy/Analityka_Danych        (wielkie litery, podkreślniki)
/kursy/analityka_danych_kurs   (podkreślniki)
/kursy/analityka-danych-2025/  (trailing slash — Vercel domyślnie: bez)
/kursy/ai-&-machine-learning   (znaki specjalne)
```

Polskie znaki (ą, ę, ó, ś, ź, ż, ć, ń, ł): **NIGDY w URL** — transliteracja automatyczna:
- `analiza-danych` (nie: `analiża-danych`)
- `sztuczna-inteligencja` (nie: `sztuczna-inteligèncja`)

### Next.js Metadata Template
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://neurova.pl'),
  title: {
    template: '%s | Neurova AI Academy',
    default: 'Neurova AI Academy — Kursy AI i Analityki Danych po Polsku',
  },
  description: 'Zdobądź certyfikat AI lub analityki danych...',  // 150-160 znaków
  openGraph: {
    locale: 'pl_PL',
    type: 'website',
    siteName: 'Neurova AI Academy',
  },
  alternates: { canonical: '/' },
};

// Per-page override (np. strona kursu):
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: `Kurs ${course.title}`,  // → "Kurs Analityki Danych | Neurova AI Academy"
    description: course.metaDescription,  // unique 150-160 chars
    openGraph: {
      title: course.title,
      description: course.metaDescription,
      images: [{ url: course.ogImage, width: 1200, height: 630 }],
    },
    alternates: { canonical: `/kursy/${course.slug}` },
  };
}
```

### Structured Data (JSON-LD) — Kompletna Lista

| Typ | Strona | Priorytet |
|---|---|---|
| `Organization` | Landing page | Krytyczny |
| `WebSite` + `SearchAction` | Landing page | Wysoki |
| `Course` | `/kursy/[slug]` | Krytyczny |
| `EducationalOccupationalCredential` | `/certyfikat/[id]` | Wysoki |
| `FAQPage` | Landing + każda strona kursu | Wysoki (AI-SEO) |
| `BreadcrumbList` | Wszystkie podstrony | Średni |
| `Article` + `author` | Blog posts | Wysoki (E-E-A-T) |
| `HowTo` | Lekcje tutorialowe | Średni (AI-SEO) |
| `Person` (persona autorów) | Blog | Średni (E-E-A-T) |

### AI-SEO (dla AI Overviews / ChatGPT / Perplexity / Gemini)

- **Wyczerpujące odpowiedzi**: Min. 1500 słów per strona kursu, 3000+ słów per pillar page
- **FAQ sections**: Min. 10 pytań per kurs (FAQ schema)
- **Definicje**: Każdy termin techniczny = akapit definicji (snippet target)
- **HowTo**: Każda lekcja z krokami = HowTo schema (voice search + AI Overviews)
- **Entities**: Spójne nazwy encji: "Neurova AI Academy", "analityka danych", "machine learning" — zawsze te same w tej samej formie
- **Knowledge graph**: `Organization` schema z `sameAs` linkami (LinkedIn, GitHub, ewentualne social)
- **Blog 2×/tydzień**: Regularność = sygnał aktywności dla indeksowania

### Landing Page SEO
- H1: "Zdobądź Certyfikat AI lub Analityki Danych — Nauka po Polsku | Neurova"
- Meta: "Darmowe kursy AI i analityki danych po polsku. Certyfikat potwierdzony egzaminem. Zacznij dziś na Neurova AI Academy."
- Hero CTA: "Zacznij naukę za darmo →"
- Social proof: licznik studentów, wydanych certyfikatów, recenzje z imieniem i **ilustrowanym avatarem** autora (nie zdjęciem AI)
- Trust signals: GDPR badge, Przelewy24 (bezpieczne płatności), flaga PL, Neurova brand

---

## 8a. Lead Generation — Content Gating (RODO-Compliant)

**Model**: 30% treści lekcji dostępne bez rejestracji (pierwsze 2 lekcje każdego modułu), reszta po podaniu emaila.

**Analiza RODO (weryfikacja zgodności):**
- Podstawa prawna zbierania emaila: **art. 6.1.b RODO** ("wykonanie umowy lub podjęcie działań na żądanie")
  - Użytkownik żąda dostępu do treści → platforma dostarcza treść → email = "konto do zapisania postępu" = usługa
  - NIE jest to "zgoda marketingowa" — to realizacja usługi
- Marketing consent: OSOBNY checkbox, domyślnie NIE, opcjonalny
- ✅ **ZGODNE Z RODO** — pod warunkiem jasnego komunikatu: "Twój email jest potrzebny do zapisania postępu nauki. Nie wymagamy hasła — wystarczy email."
- ❌ **NIEZGODNE** byłoby: uzależnienie dostępu wyłącznie od zgody marketingowej (art. 7.4 — zgoda nie może być warunkowa)

**UX flow:**
```
Lekcja 1-2 każdego modułu: dostępna bez logowania (podgląd)
Lekcja 3+: "Świetnie! Kontynuuj naukę — zapisz swój postęp."
  → Formularz: [email] [Zapisz postęp i kontynuuj]
  → Opcjonalnie: ☐ Chcę otrzymywać materiały edukacyjne (newsletter)
  → Kliknięcie "Zapisz": tworzy konto magic-link (bez hasła)
  → Magic link w emailu → klik → zalogowany, dostęp do reszty modułu
```

**% contentu:**
- Free (bez rejestracji): pierwsze 2 lekcje każdego z 12 modułów = ~16% contentu
- Gated (email required): lekcje 3+ w każdym module = ~84%
- Płatne (zakup egzaminu): egzamin + certyfikat

---

## 9. GDPR/RODO Compliance

| Wymaganie | Implementacja |
|---|---|
| Cookie consent | **Polityka cookies JEST WYMAGANA** mimo Umami (patrz analiza niżej). Kategorie: niezbędne (sesja NextAuth, CSRF) / funkcjonalne (Przelewy24 redirect cookies) / marketingowe (Brevo open tracking). Cookie policy: generowana z `config/index.ts` — zmiana providera → auto-aktualizacja listy cookies. |
| Polityka prywatności | Strona `/polityka-prywatnosci` po polsku, zgodna z art. 13 RODO |
| Regulamin | Strona `/regulamin` |
| Rejestr czynności przetwarzania | Dokument wewnętrzny (art. 30 RODO) |
| Prawo do usunięcia | API endpoint + formularz w panelu użytkownika |
| Prawo do przenoszenia | Eksport danych użytkownika w JSON |
| Dane minimalne | Zbieramy: email, imię/nazwisko (do certyfikatu), postęp nauki, historia płatności, zgody marketingowe (timestamp + IP + treść checkboxa) |
| Mailing consent | Osobne checkboxy (domyślnie: NIE) dla: newsletter edukacyjny / informacje o promocjach. Double opt-in. 1-click unsubscribe w każdym mailu (art. 21 RODO). Historia zgód w DB. |
| Bezpieczeństwo | bcrypt (hasła), HTTPS only, CSP headers, Prisma (SQL injection prevention), input validation (Zod) |
| Certyfikaty | Imię/nazwisko na certyfikacie: RODO dopuszcza (art. 6.1.b – wykonanie umowy) |
| Subprocesorzy | **Przelewy24** (PCI DSS, PL), Vercel/Supabase (EU Frankfurt), Upstash (EU), Brevo (EU, GDPR-certified). Umami: self-hosted — brak subprocesora. |
| Wiek | **Konto (bezpłatne)**: 16 lat (art. 8 RODO, Polska implementacja). **Zakup egzaminu**: 18 lat (Kodeks Cywilny art. 11 — pełna zdolność do czynności prawnych wymagana dla umów o wartości 249–349 PLN). Implementacja: checkbox "Mam co najmniej 18 lat" wymagany przy checkout; dla konta "Mam co najmniej 16 lat". |
| Retencja danych | Konta aktywne: do momentu usunięcia przez użytkownika LUB po 24 miesiącach braku aktywności → email przypomnienie → brak reakcji w 30 dni → anonimizacja. Usuniętych: dane anonimizowane natychmiast, logi techniczne: 30 dni. Dane płatności: 5 lat (Ustawa o rachunkowości). **Fix RODO**: "bezterminowo" narusza art. 5(1)(e) — zasada ograniczenia przechowywania. Konta muszą mieć określone kryterium wygaśnięcia. |

---

## 10. Weekly Content Update Mechanism (Hybrid)

```
Harmonogram cron jobów (Vercel):
  Poniedziałek 07:00 UTC → /api/cron/blog?persona=1  (Specjalistka AI — post #1 tygodnia)
  Wtorek      07:00 UTC → /api/cron/blog?persona=2  (Analityk Danych — post #1 tygodnia)
  Środa       07:00 UTC → /api/cron/blog?persona=1  (Specjalistka AI — post #2 tygodnia)
  Czwartek    07:00 UTC → /api/cron/blog?persona=2  (Analityk Danych — post #2 tygodnia)
  Niedziela   02:00 UTC → /api/cron/content-update  (kurs + egzaminy + analiza rynku pracy)

ZABEZPIECZENIE ENDPOINTU (Security Bug Fix — patrz sekcja 15):
  GET /api/cron/content-update
  Header: Authorization: Bearer ${CRON_SECRET}
  → Vercel automatycznie wysyła ten header z każdym wywołaniem Cron Job

ETAP 1 – Zebranie danych:
  → justjoin.it / nofluffjobs.com snapshot (job requirements)
  → Analiza trendów AI/data z GitHub trending, arXiv, HackerNews

ETAP 2 – Claude API analiza:
  Input: aktualne MDX kursu + snapshot rynku pracy
  Output: JSON { type: "BLOG" | "COURSE" | "EXAM_QUESTION", ... }

ETAP 3 – Routing wg typu:
  ┌─ type="BLOG"
  │    → Walidacja II (second-pass prompt: "Czy artykuł jest poprawny merytorycznie?")
  │    → Diff size check: max 20% zmiany jednorazowo (inaczej status=HOLD)
  │    → Auto-publish z flagą [AI-UPDATED: YYYY-MM-DD]
  │    → Email powiadomienie do właściciela
  │
  └─ type="COURSE" lub "EXAM_QUESTION"
       → Status: PENDING_REVIEW w DB
       → Widoczne w admin panelu: /admin/aktualizacje
       → Admin: podgląd diffu, zatwierdź / edytuj / odrzuć
       → Po zatwierdzeniu: auto-update MDX + audit log

ETAP 4 – Privacy Policy check:
  → Nowe pola danych lub nowe subprocesory? → flaga PRIVACY_REVIEW_NEEDED
  → Admin otrzymuje alert do sprawdzenia polityki prywatności
```

**Kluczowe pliki:**
- `lib/cron/contentUpdate.ts` — orchestrator pipeline
- `lib/cron/validateContent.ts` — second-pass walidacja Claude API
- `app/api/cron/content-update/route.ts` — zabezpieczony CRON_SECRET endpoint
- `app/admin/aktualizacje/page.tsx` — panel przeglądu COURSE/EXAM zmian

---

## 10a. Polityka Prywatności — Mechanizm Synchronizacji z Aplikacją

Polityka prywatności musi odzwierciedlać aktualny stan aplikacji w czasie rzeczywistym:

```
content/legal/privacy-policy.mdx    ← źródło prawdy, wersjonowane w Git
                ↑
                | auto-check przy każdym deploy
                |
lib/privacy/policyChecker.ts        ← skanuje Prisma schema + API routes
                |
                | Wykrywa: nowe modele/pola = nowe dane osobowe?
                | Wykrywa: nowe subprocesory w ENV variables?
                |
                ↓
        CI/CD pipeline warning:
        "Zmiana w modelu danych — sprawdź politykę prywatności"
        + log w ContentUpdateLog (type=PRIVACY_CHECK)
        + alert w panelu admin
```

**Zasada**: Każda zmiana w `prisma/schema.prisma` lub dodanie nowego zewnętrznego serwisu (ENV variable z URL/API key) uruchamia automatyczny check porównujący z treścią polityki prywatności. Deweloper musi potwierdzić, że polityka jest aktualna (lub ją zaktualizować), zanim CI/CD pozwoli na merge/deploy.

**Struktura polityki prywatności** (MDX z sekcjami tagowanymi):
```mdx
---
lastUpdated: 2025-01-01
version: 1.0
dataCategories: [email, name, progress, payment]
subprocessors: [stripe, supabase, vercel, upstash]
---
```
Te metadane są automatycznie porównywane z kodem przez `policyChecker.ts`.

---

## 10b. Mobile-First Design Strategy

Użytkownicy uczą się "w biegu" — priorytet: smartfon, secondary: tablet, tertiary: desktop.

**Zasady projektowania:**
- Tailwind CSS: wszystkie style zaczynają się od mobile (`sm:`, `md:`, `lg:` jako rozszerzenia)
- Touch targets: minimum **44×44px** (WCAG 2.1, Apple HIG)
- Font size: minimum **16px** body (zapobiega auto-zoom na iOS)
- Bottom navigation bar na mobile (zamiast hamburger menu) — kciuk bez wysiłku
- Progress bar lekcji: zawsze widoczny, sticky top na mobile
- Lesson player: tryb "pionowy" jako domyślny
- Egzamin: duże pola odpowiedzi, jedno pytanie na ekran (mobile) vs. widok listy (desktop)
- Offline-ready: Service Worker cache dla materiałów lekcji (PWA)
- "Zapisz postęp" automatycznie — bez konieczności klikania

**PWA (Progressive Web App):**
- `next-pwa` → service worker
- Manifest.json (ikona na home screen)
- Offline: cached lessons dostępne bez internetu
- Push notifications: "Nie zapomnij o dzisiejszej lekcji!" (opcjonalne, z opt-in)

**Layout responsywny:**
```
Mobile (< 640px):  bottom nav, single-column, full-width cards
Tablet (640-1024px): sidebar nav, two-column grid
Desktop (> 1024px): sidebar nav, course content + progress panel
```

---

## 10c. Admin Panel — Bezpieczeństwo

**Decyzja: Admin panel w tym samym repozytorium** (route `/admin`), z wielowarstwowym zabezpieczeniem.

**Uzasadnienie**: Oddzielne repo/deployment dla panelu admina nie jest bezpieczniejsze samo w sobie — bezpieczeństwo zależy od implementacji, nie lokalizacji kodu. Unikamy też operational complexity.

**Warstwy zabezpieczeń (defense in depth):**

```
Warstwa 1: HTTPS only (HSTS header)
Warstwa 2: Rate limiting na /admin/* (max 10 req/min per IP)
Warstwa 3: NextAuth middleware — role: ADMIN wymagana
Warstwa 4: TOTP 2FA (Google Authenticator / Authy)
            → Bez 2FA: nawet poprawne hasło nie wpuszcza
Warstwa 5: IP Allowlist (Next.js middleware)
            → /admin dostępne tylko z predefiniowanych IP admina
            → Konfigurowane w ENV: ADMIN_ALLOWED_IPS="1.2.3.4,5.6.7.8"
Warstwa 6: Session timeout: 30 min nieaktywności → wymuszony re-login
Warstwa 7: Audit log wszystkich akcji admina (kto, co, kiedy)
Warstwa 8: CSP headers — brak inline scripts, no eval
```

**Dlaczego IP Allowlist + 2FA > silne hasło:**
- Silne hasło można ukraść (phishing, keylogger, breach innego serwisu)
- 2FA: nawet z hasłem, atakujący potrzebuje fizycznego telefonu admina
- IP Allowlist: nawet z hasłem + 2FA, atakujący musi być w sieci admina
- Trzy niezależne warstwy = bez współpracy wszystkich trzech, brak dostępu

**Implementacja:**
- `lib/auth.ts`: role check + 2FA verification
- `middleware.ts`: IP allowlist check dla `/admin/*`
- `components/admin/TwoFactorSetup.tsx`: TOTP setup przy pierwszym logowaniu admina
- `lib/audit.ts`: log każdej akcji admina do DB

---

## 15. Cyberbezpieczeństwo — Zidentyfikowane i Naprawione Luki

### Security Bug #1 (poprzedni): Niezabezpieczony cron endpoint

**Bug**: `GET /api/cron/content-update` bez autentykacji → DoS + wyczerpanie limitu Claude API.

**Fix**: `CRON_SECRET` Bearer token + Vercel auto-injection:
```typescript
export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
}
```

---

### Security Bug #2: IDOR na certyfikatach i zasobach użytkownika

**Bug**: `GET /api/certificates/[id]` bez weryfikacji właściciela — każdy zalogowany użytkownik może pobrać certyfikat dowolnego innego użytkownika, znając UUID.

**Scenariusz**: Atakujący enumeruje UUID (np. przez sekwencję) → pobiera certyfikaty innych użytkowników → GDPR breach (imię, nazwisko, email ujawnione).

**Fix**: Zawsze sprawdź `userId` przed zwróceniem danych:
```typescript
// app/api/certificates/[id]/route.ts
const cert = await prisma.certificate.findUnique({ where: { id: params.id } });
if (!cert || cert.userId !== session.user.id) {
  return new Response('Not Found', { status: 404 }); // NIE 403 — nie ujawniamy, że zasób istnieje
}
```

Wyjątek: publiczna strona weryfikacji `/certyfikat/[uuid]` — zwraca TYLKO pola: imię, kurs, data, UUID. Nigdy: email, userId, adres.

---

### Security Bug #3: Brak idempotentności przy generowaniu certyfikatów

**Bug**: Przelewy24 może wysłać webhook 2× (retry po timeout) → użytkownik otrzymuje 2 certyfikaty za 1 opłatę LUB kod przyznaje dostęp dwukrotnie → możliwość exploitu (race condition).

**Scenariusz**: Atakujący celowo powoduje duplikat notyfikacji → 2 certyfikaty → sprzedaje drugi.

**Fix**: Idempotency key + DB unique constraint + Redis distributed lock:
```typescript
// Prisma schema:
// Certificate: @@unique([userId, courseId])
// Payment: @@unique([p24SessionId])  ← P24 session ID jako idempotency key

// app/api/payment/webhook/route.ts
const lock = await redis.set(`lock:payment:${body.sessionId}`, '1', 'NX', 'EX', 30);
if (!lock) return new Response('Already processing', { status: 200 }); // P24 czeka, nie retry

const existing = await prisma.payment.findUnique({ where: { p24SessionId: body.sessionId } });
if (existing) return new Response('Already processed', { status: 200 });
// → wtedy dopiero: utwórz certyfikat
```

---

### Security Bug #4 (RODO): Pierwotny plan — "konta aktywne bezterminowo"

(Naprawione wcześniej w sekcji 9 — storage limitation art. 5(1)(e))

---

### Security Bug #5: Manipulacja kwotą płatności (Price Tampering) — KRYTYCZNY

**Bug**: Webhook Przelewy24 nie weryfikuje, czy kwota w powiadomieniu odpowiada oczekiwanej cenie egzaminu. Atakujący inicjuje sesję P24 z kwotą 0.01 PLN, opłaca 1 grosz, a webhook przyznaje dostęp do egzaminu za 249 PLN.

**Scenariusz ataku**:
1. Atakujący modyfikuje request do `/api/payment/create-session` (np. przez devtools lub Burp Suite) → ustawia `amount=1` zamiast `amount=24900`
2. P24 procesuje płatność: 0.01 PLN zapłacone
3. Webhook przychodzi: `{ amount: 1, sessionId: "abc", sign: "valid" }` — podpis CRC jest POPRAWNY (bo P24 nie wie jaka powinna być cena)
4. Nasz kod weryfikuje CRC ✅ → przyznaje dostęp → atakujący zdaje egzamin za 1 grosz

**Fix**: Przechowaj oczekiwaną kwotę w DB przy tworzeniu sesji; porównaj z webhook:
```typescript
// app/api/payment/create-session/route.ts
const expectedAmount = config.payment.examPrices[courseSlug]; // 24900 lub 34900 (grosze)
// Zapisz w DB PRZED wysłaniem do P24
const paymentRecord = await prisma.payment.create({
  data: {
    p24SessionId: sessionId,
    expectedAmountGrosze: expectedAmount, // nie amount z requestu użytkownika!
    courseSlug,
    userId: session.user.id,
    status: 'PENDING',
  }
});
// Wyślij do P24 amount=expectedAmount (hardcoded z config, nie z body requestu)

// app/api/payment/webhook/route.ts
const payment = await prisma.payment.findUnique({ where: { p24SessionId: body.sessionId } });
if (!payment) return new Response('Not found', { status: 404 });

// KLUCZOWA WERYFIKACJA KWOTY:
if (body.amount !== payment.expectedAmountGrosze) {
  console.error(`SECURITY: Price tampering! Expected ${payment.expectedAmountGrosze}, got ${body.amount}`);
  await prisma.securityLog.create({ data: { type: 'PRICE_TAMPERING', userId: payment.userId, details: JSON.stringify(body) } });
  return new Response('Amount mismatch', { status: 400 });
  // NIGDY nie przyznawaj dostępu
}
```

**Zasada**: Kwota ZAWSZE pochodzi z naszego config/DB — NIGDY z danych wejściowych użytkownika lub z webhook (poza weryfikacją).

---

### Security Bug #5b (RODO): Nowy — `PAYMENT_MODE=mock` dostępny w produkcji

**Bug**: Jeśli admin przypadkowo ustawi `PAYMENT_MODE=mock` na produkcji, każdy może omijać płatność.

**Fix**: Hard block w kodzie (nie tylko config):
```typescript
// lib/payment.ts
if (process.env.NODE_ENV === 'production' && process.env.PAYMENT_MODE === 'mock') {
  throw new Error('CRITICAL: Mock payment mode cannot be used in production');
}
```

CI/CD check przed deploy: `if [ "$PAYMENT_MODE" = "mock" ] && [ "$NODE_ENV" = "production" ]; then exit 1; fi`

---

### Security Bug #6 (KRYTYCZNY — szybki atak): Admin IP Allowlist Fail-Open

**Bug**: Jeśli zmienna `ADMIN_ALLOWED_IPS` jest pusta lub niezdefiniowana, middleware może pomyłkowo ZEZWALAĆ wszystkim na dostęp do panelu admina (fail-open zamiast fail-safe fail-deny).

**Scenariusz ataku** (szybki w praktyce):
1. Deweloper deployuje na Vercel bez ustawienia `ADMIN_ALLOWED_IPS`
2. Middleware: `allowedIPs.length === 0` → logika "brak ograniczeń" → admin dostępny dla wszystkich
3. Atakujący skanuje `/admin` → loguje się z hasłem (brute force lub phishing) → pomija IP check
4. Pełen dostęp do bazy danych użytkowników, treści kursów, kluczy API → GDPR breach

**Dlaczego szybki**: Prosta pomyłka konfiguracyjna podczas każdego nowego deployment — bez deliberate attack, wystarczy brak ENV var.

**Fix — Fail-Safe Deny (zasada "default deny"):**
```typescript
// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const rawAllowedIPs = process.env.ADMIN_ALLOWED_IPS;
    
    // FAIL-SAFE: jeśli ENV nie ustawiony → ZAWSZE blokuj
    if (!rawAllowedIPs || rawAllowedIPs.trim() === '') {
      console.error('SECURITY: ADMIN_ALLOWED_IPS not configured — blocking all admin access');
      return NextResponse.json({ error: 'Admin access not configured' }, { status: 403 });
    }
    
    const allowedIPs = rawAllowedIPs.split(',').map(ip => ip.trim()).filter(Boolean);
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
                     ?? req.headers.get('x-real-ip') 
                     ?? '';
    
    if (!allowedIPs.includes(clientIP)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

**Dodatkowe zabezpieczenie**: Vercel deployment protection → Environment Variables wymagane przed deploy (Vercel Required Env Vars feature).

---

## 15a. Dodatkowe Wyjaśnienia

### Polityka Cookies — Analiza (wymagana mimo Umami)

Umami self-hosted: domyślnie **cookieless** (używa localStorage lub fingerprint). JEDNAK:
- **Sesja NextAuth** = cookie `__Secure-next-auth.session-token` → NIEZBĘDNY cookie, brak zgody wymagany
- **CSRF token** NextAuth = cookie → NIEZBĘDNY
- **Przelewy24**: podczas redirect na stronę P24 → ich platforma może ustawiać cookies (poza naszą kontrolą → obowiązek informacyjny)
- **Brevo tracking pixel** w emailach → jeśli używamy open tracking = cookies przy śledzeniu kliknięć → zgoda wymagana dla kategorii "marketingowe"

**Wniosek**: Polityka cookies NIE jest opcjonalna. Kategorie:
1. **Niezbędne** (bez zgody): session, CSRF, język
2. **Funkcjonalne** (bez zgody): postęp nauki (localStorage), tryb ciemny
3. **Marketingowe** (z opt-in zgodą): Brevo open tracking w emailach

**Synchronizacja z kodem** (`config/index.ts` → cookie policy):
- Dodanie nowego providera do `config.analytics` → automatyczny alert "sprawdź politykę cookies"
- Zmiana `PAYMENT_PROVIDER`: P24 → Stripe → `policyChecker.ts` generuje diff listy cookies w polityce
- Cookie policy jest MDX z sekcjami tagowanymi `{/* provider: przelewy24 */}` → skrypt sprawdza, czy tagi match z aktywnym providerem w config

### LinkedIn ToS — Weryfikacja

Metoda deep link `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&...`:
- ✅ **OFICJALNA metoda LinkedIn** — dokumentowana w LinkedIn Developer Docs
- ✅ Używana przez: Coursera, Anthropic, Google, AWS, Microsoft — bez naruszeń ToS
- ✅ Wymaga manualnej akcji użytkownika (kliknięcia) — brak automatyzacji
- ✅ Nie używamy LinkedIn OAuth (nie wymagamy dostępu do konta)
- ✅ Brak scrapingu, brak automatycznych postów
- Implementacja: zwykły `<a href="...">` link otwierający LinkedIn — **ZGODNE z ToS**

### Język materiałów edukacyjnych

- Wszystkie treści kursów, lekcje, opisy, FAQ: **po polsku**
- Techniczne skróty i nazwy własne: pozostają w oryginale angielskim
  - DataFrame ✅, API ✅, MCP (Model Context Protocol) ✅, LLM ✅, SQL ✅
  - Power BI ✅, Tableau ✅, PyTorch ✅, scikit-learn ✅
  - NIE tłumaczymy na siłę: "Ramka Danych" ❌, "Interfejs Programowania Aplikacji" ❌
- Blog: po polsku, z angielskimi terminami technicznymi w kontekście (dla SEO i naturalności)

### Admin Panel — PC First

- Admin panel (`/admin/*`): **desktop-first** layout
  - Sidebar navigation, wielokolumnowe widoki, tabele z danymi, edytor tekstu MDX
  - Minimalne wsparcie mobilne (emergency access), bez optimizacji na telefon
- Reszta aplikacji: mobile-first (patrz sekcja 10b)

### Brevo Marketing Automation — Model Duolingo

Duolingo wysyła: natychmiastowe powiadomienie przy przerwaniu streaka, eskalującą częstotliwość przy braku aktywności, "streak shame" copywriting, personalizowane timing. Adaptujemy ten model:

```
DB: User.currentStreak (dni), User.longestStreak, User.lastActiveAt

STREAK TRACKING (cron: codziennie 08:00):
  → Jeśli użytkownik uczył się wczoraj: streak++
  → Jeśli brak aktywności od 24h: streak = 0 + trigger email

TRIGGER 1: Nowy lead (content gating)
  Dzień 0 (natychmiast):  "Twój dostęp do Neurova jest gotowy — zaloguj się"
  Dzień 1 (18:00):        "Dzień 2. Zbuduj swój streak AI — jedna lekcja dziś wystarczy"
  Dzień 3 (brak aktywności): "[STREAK ZAGROŻONY] Masz 3 dni — ale Twój postęp jeszcze czeka"
  Dzień 7 (brak aktywności): "Twój streak wynosi 0. Inni kursanci ukończyli już 2 moduły"
  Dzień 14:               "Ostatnia szansa: Twoje konto wygasa za 14 dni bez aktywności"

TRIGGER 2: Streak milestone
  7 dni z rzędu:    "🔥 7-dniowy streak! Jesteś w top 20% kursantów Neurova"
  30 dni z rzędu:   "Miesięczny streak! Specjalna odznaka + -15% na egzamin"

TRIGGER 3: Ukończono lekcję
  Jeśli < 30min od poprzedniej: BRAK emaila (nie zasypujemy)
  Pierwsza lekcja dnia: "Dobry start! [X]% kursu za Tobą"

TRIGGER 4: Streak break (streak był >= 3 dni i zeruje się)
  Natychmiast (push PWA + email):
    "Twój {N}-dniowy streak właśnie przepadł. Wróć dziś — zacznij od nowa."
  Kolejny dzień 20:00: "Jeden dzień temu straciłeś streak. Jeden klik go przywraca."

TRIGGER 5: Ukończono kurs
  Natychmiast: "100%! Jesteś gotowy na egzamin certyfikacyjny Neurova"
  Dzień 3 (bez zakupu): "Egzamin czeka — 249 PLN za certyfikat, który zostaje na CV"
  Dzień 7 (bez zakupu): "Ostatni krok: [Przejdź do egzaminu →]"

TRIGGER 6: Zaliczono egzamin
  Natychmiast: Email + certyfikat PDF w załączniku + link LinkedIn share

TRIGGER 7: Niezaliczono egzaminu
  1h po: "Nie tym razem — ale wiesz co poprawić. Wróć kiedy będziesz gotowy."
  Dzień 7:  "Gotowy na drugie podejście? Sprawdź co poprawić."
```

Timing: Wszystkie emaile "aktywacyjne" wysyłane między **17:00–20:00** (czas po pracy — peak engagement).
Personalizacja: imię użytkownika + % ukończonego kursu + liczba dni do egzaminu.
Wszystkie emaile marketingowe: wymagają opt-in + link unsubscribe.

---

## 3a. Modele AI — Konfiguracja (Zatwierdzone)

**Modele wybrane przez właściciela:**
- **Deepseek R1 0528** — reasoning model, content analysis, article drafts
- **Qwen3 8B** — szybki model pomocniczy, validacja, embeddingi
- **Serwer lokalny**: LM Studio na `192.168.0.180:1234` (OpenAI-compatible API)

> ⚠️ **UWAGA**: `192.168.0.180` to **dynamiczny adres lokalnej sieci** — może się zmienić. Zawsze konfiguruj przez ENV zmienną, nigdy nie hardcoduj. Serwer lokalny jest dostępny TYLKO z tej samej sieci — dev/testing. Produkcja → Deepseek Cloud API.

### Podział zadań według modelu

| Zadanie | Model (dev/local) | Model (prod/cloud) | Endpoint |
|---|---|---|---|
| Weekly content analysis | Deepseek R1 0528 (local) | Deepseek API R1 | `AI_LOCAL_URL/v1` |
| Draft artykułu blogowego | Deepseek R1 0528 (local) | Deepseek API R1 | `AI_LOCAL_URL/v1` |
| Humanizacja i quality check | Claude Sonnet | Claude Sonnet | Anthropic API |
| Semantic search / embeddingi | Qwen3 8B (local) | Deepseek API lub Nomic | `AI_LOCAL_URL/v1` |
| Walidacja merytoryczna kursu | Deepseek R1 0528 (local) | Deepseek API R1 | `AI_LOCAL_URL/v1` |
| Egzamin: odpowiedzi otwarte | Claude Haiku | Claude Haiku | Anthropic API |
| Privacy policy diff check | Prosty regex + Zod (brak AI) | — | — |

### Implementacja (config-driven)
```typescript
// config/index.ts
ai: {
  localBaseUrl: process.env.AI_LOCAL_URL || 'http://192.168.0.180:1234',  // LM Studio
  localDeepseekModel: 'deepseek-r1-0528',    // nazwa modelu w LM Studio
  localQwenModel: 'qwen3-8b',
  contentProvider: process.env.AI_CONTENT_PROVIDER || 'local',  // 'local' | 'deepseek-api' | 'claude'
  qualityProvider: 'claude',  // zawsze Claude dla finałowej humanizacji
  deepseekApiKey: process.env.DEEPSEEK_API_KEY,  // dla produkcji
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
}
```

```env
# .env.local (development — LM Studio)
AI_LOCAL_URL=http://192.168.0.180:1234
AI_CONTENT_PROVIDER=local

# .env.production (Vercel)
AI_CONTENT_PROVIDER=deepseek-api
DEEPSEEK_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

**Szacowane oszczędności vs. Claude-only**: ~70–80% kosztów API. Qwen3 8B jest mały (szybki, tani) ale wystarczający dla zadań pomocniczych.

---

## 11. Automated Tests (Playwright)

25 user stories do zautomatyzowanego testowania:

```
tests/
├── auth/
│   ├── 01-registration.spec.ts          # Rejestracja nowego użytkownika
│   ├── 02-login.spec.ts                 # Logowanie
│   ├── 03-password-reset.spec.ts        # Reset hasła przez email
│   └── 04-logout.spec.ts               # Wylogowanie
├── courses/
│   ├── 05-course-catalog.spec.ts        # Przeglądanie katalogu kursów
│   ├── 06-course-detail.spec.ts         # Strona kursu (SEO tags, content)
│   ├── 07-lesson-navigation.spec.ts     # Nawigacja między lekcjami
│   └── 08-progress-tracking.spec.ts     # Oznaczenie lekcji, zapis postępu
├── exam/
│   ├── 09-exam-purchase.spec.ts         # Zakup dostępu (Stripe test mode)
│   ├── 10-exam-flow.spec.ts             # Podejście do egzaminu, odpowiedzi
│   ├── 11-exam-pass.spec.ts             # Zaliczenie → generowanie certyfikatu
│   └── 12-exam-fail.spec.ts            # Niezaliczenie → komunikat, retry
├── certificates/
│   ├── 13-certificate-download.spec.ts  # Pobieranie PDF
│   ├── 14-linkedin-share.spec.ts        # Deep link LinkedIn
│   └── 15-public-verification.spec.ts  # Publiczna strona /certyfikat/[uuid]
├── dashboard/
│   ├── 16-user-dashboard.spec.ts        # Panel użytkownika (certyfikaty, postęp)
│   └── 17-protected-routes.spec.ts     # Redirect niezalogowanych → /logowanie
├── compliance/
│   ├── 18-cookie-consent.spec.ts        # Banner, persistence, kategorie
│   └── 19-gdpr-forms.spec.ts           # Formularz żądania usunięcia danych
├── landing/
│   ├── 20-landing-page.spec.ts          # Load < 3s, H1, CTA, social proof
│   └── 21-seo-meta.spec.ts             # title, description, OG tags, JSON-LD
├── admin/
│   ├── 22-content-updates.spec.ts       # Podgląd propozycji aktualizacji
│   └── 23-content-approval.spec.ts     # Zatwierdzenie/odrzucenie aktualizacji
└── responsive/
    ├── 24-mobile-viewport.spec.ts       # iPhone SE, iPhone 14, Galaxy S21
    └── 25-contact-form.spec.ts         # Formularz kontaktowy
```

---

## 12. Manual Tests

| # | Test | Obszar |
|---|---|---|
| M1 | Weryfikacja wizualna UI: Chrome, Firefox, Safari, Edge | Cross-browser |
| M2 | Responsywność: iPhone 12, Samsung Galaxy, iPad | Mobile |
| M3 | Jakość PDF certyfikatu: czcionki, kolory, drukowanie | Certyfikaty |
| M4 | LinkedIn sharing: czy badge pojawia się w profilu | Social |
| M5 | Email delivery: rejestracja, reset hasła, certyfikat | Email |
| M6 | Płatność Stripe: pełny flow z kartą testową 4242... | Płatności |
| M7 | BLIK payment flow | Płatności PL |
| M8 | Cookie consent: trwałość między sesjami | RODO |
| M9 | Formularz żądania usunięcia danych (RODO) | RODO |
| M10 | Eksport danych użytkownika (JSON) | RODO |
| M11 | Core Web Vitals: **PageSpeed Insights mobile = 99%** — https://pagespeed.web.dev/ → tryb Mobile → iteruj aż wynik = 99% (patrz sekcja 18: PageSpeed Quality Gate) | Performance |
| M12 | SEO audit: Screaming Frog / Search Console | SEO |
| M13 | Accessibility audit: axe DevTools, NVDA screen reader | A11y |
| M14 | Schema.org: Google Rich Results Test | AI-SEO |
| M15 | Security headers: securityheaders.com | Security |
| M16 | Admin panel: zarządzanie treścią kursów | Admin |
| M17 | Weekly cron: manualne wyzwolenie + weryfikacja logu | Content |
| M18 | QR code na certyfikacie: skan telefonem → weryfikacja URL | Certyfikaty |
| M19 | Stripe Tax: auto VAT na fakturze | Płatności |
| M20 | Strona 404 (custom, SEO-friendly) | UX |

---

## 13. Implementation Phases

| Faza | Zakres | Czas |
|---|---|---|
| **1. Setup** | Next.js + TypeScript + Tailwind + Prisma + Docker Compose | Tydzień 1 |
| **2. Auth + DB** | NextAuth.js, schema DB, rejestracja/logowanie | Tydzień 2 |
| **3. Landing Page** | SEO hero, structured data, CTA, mobile-first (bottom nav, PWA manifest) + **PageSpeed 99% gate** przed przejściem do fazy 4 | Tydzień 3 |
| **4. Course Content** | MDX files (oba kursy), lesson player, nawigacja — mobile-first layout | Tydzień 4–5 |
| **5. Progress Tracking** | DB progress, dashboard, %, odblokowanie egzaminu | Tydzień 6 |
| **6. Payment + Exam** | Stripe integration, exam runner, scoring | Tydzień 7 |
| **7. Certificates** | PDF generation, QR code, LinkedIn link, public page | Tydzień 8 |
| **8. Content Cron** | Weekly update pipeline (hybrid), admin review UI, CRON_SECRET auth | Tydzień 9 |
| **9. RODO + Cookie** | Cookie consent, polityka prywatności (MDX + policyChecker.ts), formularz, mailing consent | Tydzień 10 |
| **9a. Admin Security** | 2FA (TOTP), IP allowlist middleware, audit log, session timeout | Tydzień 10 |
| **9b. Mailing** | Brevo integracja, szablony emaili, admin mailing panel, double opt-in | Tydzień 10 |
| **9c. Analytics** | Umami self-hosted setup, tracking events (course start, exam complete, cert download) | Tydzień 10 |
| **9d. Config** | `config/index.ts`, `.env.example`, policyChecker.ts, blog humanization pipeline | Tydzień 11 |
| **10. SEO Polish** | AI images (WebP), structured data, sitemap, perf | Tydzień 11 |
| **11. Testing** | Playwright (25 tests), Jest, manual test list | Tydzień 12 |
| **12. Deploy Prep** | Docker prod, CI/CD, monitoring, Vercel/VPS + **PageSpeed 99% final audit** przed deployem produkcyjnym | Tydzień 13 |

---

## 13a. Mailing — Admin Panel & RODO

### Integracja z Brevo (panel admina)
```
app/admin/mailing/
├── page.tsx           # Lista kampanii i subskrybentów
├── nowa-kampania/     # Kreator kampanii (WYSIWYG)
├── subskrybenci/      # Lista z statusem zgody RODO
└── szablony/          # Szablony emaili
```

**Przepływ zgody RODO przy rejestracji:**

> ⚠️ **RODO art. 7(4) + Motyw 32**: Żadne pole wyboru NIE MOŻE być wstępnie zaznaczone (pre-checked), nawet jeśli jest wymagane. Użytkownik MUSI samodzielnie i świadomie kliknąć checkbox. "Milczenie, pola zaznaczone z góry lub bezczynność nie stanowią zgody."

```
Formularz rejestracji (wszystkie checkboxy domyślnie: ☐ niezaznaczone):
  ☐ Akceptuję Regulamin i Politykę Prywatności (wymagane — blokuje submit dopóki niezaznaczone)
  ☐ Mam co najmniej 16 lat (wymagane — blokuje submit)
  ☐ Chcę otrzymywać newsletter z materiałami edukacyjnymi (opcjonalne)
  ☐ Chcę otrzymywać informacje o promocjach i nowych kursach (opcjonalne)

Przy zakupie egzaminu (dodatkowy ekran):
  ☐ Mam co najmniej 18 lat i mogę zawierać umowy online (wymagane — blokuje płatność)
```

→ DB: User.marketingConsent (Boolean), User.marketingConsentAt (DateTime), User.marketingConsentIp (String)
→ Double opt-in: email potwierdzający po zaznaczeniu newslettera
→ 1-click unsubscribe: link w każdym emailu marketingowym (art. 21 RODO)
```

**Typy emaili:**
| Typ | Podstawa prawna RODO | Zgoda wymagana |
|---|---|---|
| Rejestracja, reset hasła | art. 6.1.b (wykonanie umowy) | NIE |
| Certyfikat | art. 6.1.b (wykonanie umowy) | NIE |
| Newsletter edukacyjny | art. 6.1.a (zgoda) | TAK — opt-in |
| Promocje, oferty | art. 6.1.a (zgoda) | TAK — osobny opt-in |
| Powiadomienia o nieaktywności | art. 6.1.c (obowiązek prawny) | NIE |

---

## 13b. Plik Konfiguracyjny — Centralne Zarządzanie

Jeden plik `config/index.ts` jako źródło prawdy dla wszystkich zewnętrznych zależności:

```typescript
// config/index.ts
export const config = {
  site: {
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'Neurova AI Academy',
    brand: process.env.NEXT_PUBLIC_BRAND || 'Neurova',
    domain: process.env.NEXT_PUBLIC_DOMAIN || 'neurova.pl',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://neurova.pl',
    supportEmail: process.env.SUPPORT_EMAIL || 'kontakt@neurova.pl',
  },
  analytics: {
    provider: process.env.ANALYTICS_PROVIDER || 'umami', // 'umami' | 'plausible' | 'none'
    umamiWebsiteId: process.env.UMAMI_WEBSITE_ID,
    umamiScriptUrl: process.env.UMAMI_SCRIPT_URL,
    plausibleDomain: process.env.PLAUSIBLE_DOMAIN,
  },
  email: {
    provider: process.env.EMAIL_PROVIDER || 'brevo', // 'brevo' | 'resend' | 'smtp'
    brevoApiKey: process.env.BREVO_API_KEY,
    resendApiKey: process.env.RESEND_API_KEY,
    fromName: process.env.EMAIL_FROM_NAME || 'NaukaAI',
    fromAddress: process.env.EMAIL_FROM || 'noreply@naukaai.pl',
  },
  payment: {
    provider: process.env.PAYMENT_PROVIDER || 'przelewy24',
    mode: process.env.PAYMENT_MODE || 'sandbox', // 'mock' | 'sandbox' | 'live'
    p24MerchantId: process.env.P24_MERCHANT_ID,
    p24ApiKey: process.env.P24_API_KEY,
    p24CrcKey: process.env.P24_CRC_KEY,
    currency: 'PLN',
    examPrices: {
      'analityka-danych': Number(process.env.EXAM_PRICE_ANALYTICS) || 24900, // grosze
      'ai-machine-learning': Number(process.env.EXAM_PRICE_AI) || 34900,
    },
  },
} as const;

export type AnalyticsProvider = typeof config.analytics.provider;
export type EmailProvider = typeof config.email.provider;
```

Wszystkie komponenty importują stałe z `config/index.ts`, nigdy bezpośrednio z `process.env`.
Zmiana domeny lub providera = tylko zmiana zmiennych środowiskowych (`.env` + Vercel dashboard).

Plik `.env.example` z dokumentacją każdej zmiennej → obowiązkowy w repo.

---

## 13c. Blog Content — Strategia "Human-Voice" (Anti-AI-Detection)

Google nie penalizuje treści AI per se — karze niską jakość. Ryzyko: algorytmy detekcji AI treści mogą obniżyć ranking. Strategia:

**Persony Autorów (2 osoby, różne płcie):**

**Persona 1 — Specjalistka AI:**
```
System prompt:
"Jesteś doświadczoną specjalistką sztucznej inteligencji z ponad 8 lat praktyki 
w branży technologicznej w Polsce. Specjalizujesz się w zastosowaniach LLM i ML 
w środowisku produkcyjnym. Piszesz artykuł dla bloga Neurova AI Academy.
Pisz w pierwszej osobie liczby pojedynczej rodzaju żeńskiego.
Używaj konkretnych liczb (zarobki w PLN, % wzrostu, liczba ofert pracy), 
ale NIE podawaj nazw konkretnych pracodawców — pisz: 'branża e-commerce', 
'sektor finansowy', 'polskie startupy'. 
Unikaj: 'warto zauważyć', 'należy podkreślić', 'z pewnością', 'niewątpliwie',
'jest to ważne', 'ponadto', 'co więcej', 'w związku z powyższym'.
Pisz jak do koleżanki z branży: konkretnie, bez lania wody, czasem z dystansem."
```

**Persona 2 — Analityk Danych:**
```
System prompt:
"Jesteś doświadczonym analitykiem danych z ponad 10 lat pracy z danymi w Polsce. 
Zaczynałeś od Excela, teraz piszesz SQL-a przez sen i budujesz dashboardy w Power BI.
Piszesz artykuł dla bloga Neurova AI Academy.
Pisz w pierwszej osobie liczby pojedynczej rodzaju męskiego.
Używaj konkretnych liczb i własnych obserwacji z rynku, 
ale NIE podawaj nazw konkretnych firm — ogólnie: 'duże firmy produkcyjne', 
'banki', 'retail'. 
Unikaj: 'warto zauważyć', 'należy podkreślić', 'z pewnością', 'należy zaznaczyć',
'jest to istotne', 'ponadto', 'co więcej', 'jednakże' (jako łącznik AI).
Pisz jak do kolegi który dopiero zaczyna: z doświadczenia, bez zbędnej teorii."
```

**Przypisanie persony — zasada stałości (blog + lekcje kursów):**

| Treść | Persona | Styl |
|---|---|---|
| Kurs: AI i Machine Learning (wszystkie lekcje) | Persona 1 (Specjalistka AI) | Nauczyciel/ekspert: "Kiedy pierwszy raz pracowałam z transformer architecture..." |
| Kurs: Analityka Danych (wszystkie lekcje) | Persona 2 (Analityk Danych) | Nauczyciel/ekspert: "Po 10 latach z Excelem, wiem że największy błąd to..." |
| Blog: tematy AI/ML/LLM | Persona 1 | Publicysta/komentator: opinie, obserwacje rynkowe |
| Blog: tematy Analytics/BI/Python | Persona 2 | Publicysta/komentator: case studies, porady praktyczne |

**Stałość persony = spójność E-E-A-T**: Google widzi autora, który systematycznie pisze na jeden temat → wyższy autorytet. Każda lekcja ma sekcję "Autor lekcji: [imię persony], [tytuł]" widoczną na stronie.

**Post-processing pipeline (2-pass) — stosowany dla BLOGA I LEKCJI KURSÓW:**
```
Pass 1 (Generowanie): Deepseek R1 / Qwen3 → treść robocza (po polsku)
  Tryb "BLOG": artykuł komentatorski, opinia, case study
  Tryb "LESSON": lekcja edukacyjna, wyjaśnienie → ćwiczenie → podsumowanie

Pass 2 (Humanizacja Claude Sonnet) — identyczny dla obu trybów:
  → Usuń typowe POLSKIE AI-markery:
    "z pewnością", "warto zauważyć", "należy podkreślić", "niewątpliwie",
    "jest to ważne", "ponadto", "co więcej", "w związku z powyższym",
    "należy zaznaczyć", "warto wspomnieć", "należy jednak pamiętać"
  → Dodaj głos persony: konkretne liczby, 1. osoba, polskie obserwacje rynkowe
    Persona 1: pewna siebie ekspertka, zdystansowana ironia, precyzja techniczna
    Persona 2: spokojny mentor, analogie do codziennych danych, doświadczenie z lat
  → Sprawdź: E-E-A-T signals, min. 3 własne "obserwacje" autora
  → Blog: > 1500 słów, min. 1 źródło/statystyka z datą
  → Lekcja: struktura "Cel → Teoria → Przykład → Ćwiczenie → Podsumowanie"
             pierwsze zdanie lekcji: w 1. osobie ("Dziś pokażę Ci...", "Kiedy po raz pierwszy...")
```

**System prompt — tryb LESSON (uzupełnienie do trybu BLOG):**
```
# Persona 1 — tryb lekcji kursu AI i Machine Learning:
"Piszesz lekcję kursu 'AI i Machine Learning' dla Neurova AI Academy.
Jesteś autorką tego kursu — piszesz w 1. osobie l. poj. rodz. żeńskiego.
Zacznij lekcję od osobistej anegdoty lub obserwacji z praktyki zawodowej.
Wyjaśnij koncepcję prosto → potem technicznie. Zakończ: 'W następnej lekcji...'
Ton: ekspert-nauczyciel, nie podręcznik akademicki."

# Persona 2 — tryb lekcji kursu Analityki Danych:
"Piszesz lekcję kursu 'Analityka Danych' dla Neurova AI Academy.
Jesteś autorem tego kursu — piszesz w 1. osobie l. poj. rodz. męskiego.
Zacznij od problemu, który rozwiązywałeś w prawdziwym projekcie.
Prowadź przez rozwiązanie krok po kroku. Zakończ: 'W następnej lekcji...'
Ton: praktyk-mentor, analogie do rzeczy znanych z codzienności."
```

**Wizualna tożsamość person — ilustracje zamiast zdjęć:**

> ✅ **Decyzja zatwierdzona przez właściciela**: Persony prezentowane jako **ilustrowane postacie** (nie realistyczne zdjęcia AI).

**Dlaczego ilustracje, nie zdjęcia:**
- Zdjęcia AI → ryzyko "uncanny valley" (twarz wygląda nieprawdziwie) → podważa zaufanie
- Ilustracje → jasno artystyczne, nie udają prawdziwych fotografii → brak problemu etycznego
- Spójność z archetypem marki (Mędrzec + Bohater) → ilustracje można zaprojektować z atrybutami wizualnymi
- Przyszłościowe: Google/GDPR coraz ostrzej patrzy na deepfake-like "prawdziwe" zdjęcia AI person

**Styl ilustracji — specyfikacja:**
```
Styl: Profesjonalna ilustracja wektorowa / semi-flat design
      (wzór: Notion illustrations, Headspace characters — artystyczne, nie kreskówkowe)
Paleta: Brand colors — Navy #1B2E4B, Gold #C9A94B, Teal #00A896, tło jaśniejsze
Format: WebP 400×400px, PNG backup, przezroczyste tło (dla dowolnego bg)
Format dla emaili: PNG z białym tłem (kompatybilność z klientami email)

Persona 1 — Specjalistka AI (archetyp: Mędrzec + element Bohatera):
  - Kobieta, ~35 lat (wiek sugerowany przez styl, nie fotorealizm)
  - Wyraz twarzy: pewna siebie, skupiona, lekki uśmiech
  - Atrybuty wizualne: elementy graficzne sugerujące AI/sieć neuronową w tle lub na ubraniu
  - Kolory dominujące: Teal + Navy (mądrość, technologia)

Persona 2 — Analityk Danych (archetyp: Mędrzec + doświadczenie):
  - Mężczyzna, ~40 lat (sugerowane przez styl)
  - Wyraz twarzy: spokojny, analityczny, przystępny
  - Atrybuty wizualne: elementy wykresów/danych w tle lub subtelnie w stylu ubioru
  - Kolory dominujące: Navy + Gold (wiedza, autorytet)
```

**Prompt dla DALL-E 3 / Midjourney (przykładowy):**
```
Persona 1:
"Professional flat-style illustration portrait of a confident Polish woman, 
approximately 35 years old, AI/ML specialist. Semi-flat vector illustration style,
clean professional look (similar to Notion or Headspace illustration style).
Colors: teal #00A896 and navy blue #1B2E4B accents.
Subtle tech/neural network design elements in background.
Transparent background, 400x400px, no text, WebP format."

Persona 2:
"Professional flat-style illustration portrait of an experienced Polish man,
approximately 40 years old, data analyst. Semi-flat vector illustration style,
clean professional look (similar to Notion or Headspace illustration style).
Colors: navy blue #1B2E4B and gold #C9A94B accents.
Subtle data chart/dashboard design elements in background.
Transparent background, 400x400px, no text, WebP format."
```

**Pliki:** `public/authors/persona-ai-specialist.webp`, `public/authors/persona-data-analyst.webp`
Generuje właściciel jednorazowo (zewnętrzne zadanie). Zatwierdzenie → zapisanie do repo.

**Sygnały E-E-A-T (Google):**
- Dwie stałe persony autorów z biogramem i **ilustrowanym avatarem** (nie zdjęciem AI)
- Schema.org `author` z `jobTitle` i `affiliation`
- Linki do zewnętrznych źródeł (raportów, GUS, PMI Poland)
- Data ostatniej aktualizacji artykułu widoczna na stronie
- Sekcja "Autor sprawdził ten artykuł: [data]"

**Treści flagowane jako AI — testy:**
- Przed publikacją: walidacja przez narzędzie jak Originality.ai lub Copyleaks
- Jeśli score AI > **80%**: pass 3 (regeneracja z innym seed / temperaturą) lub manualny redaktor

---

## 13e. Refaktoring: Wydajność i Bezpieczeństwo

### Wydajność

| Obszar | Rozwiązanie |
|---|---|
| **Renderowanie** | Strony kursów: ISR (`revalidate: 3600`) — generowane statycznie, odświeżane co godzinę |
| | Strony lekcji: SSR z Streaming (React Suspense) dla treści MDX |
| | Landing page: SSG — w pełni statyczny, zero latency |
| **Middleware** | Edge Runtime dla auth middleware (`runtime: 'edge'`) → <5ms latency vs ~50ms Node |
| **Caching** | Redis (Upstash) dla: exam questions (cache 1h), user progress (cache 5min), session data |
| | `unstable_cache` Next.js dla DB queries w Server Components |
| **Baza danych** | Supabase PgBouncer: connection pooling (max 20 connections vs 100 bez poolera) |
| | Prisma: `$transaction` dla atomowych operacji (płatność + dostęp do egzaminu) |
| | Indeksy DB: `userId + courseId` (progress), `userId + status` (certificates) |
| **Obrazy** | `next/image` z `sizes` prop — serwuje właściwy rozmiar per viewport |
| | AVIF + WebP fallback, placeholder=blur |
| **Fonty** | `next/font/google` z `display: swap` + self-hosting (eliminacja zewnętrznych requestów) |
| **Bundle** | `@next/bundle-analyzer` w CI — alert gdy chunk > 200kB |
| | Dynamic imports dla: PDF renderer, TOTP library, exam chart components |
| **PWA** | `next-pwa`: service worker cachuje lekcje offline, pre-fetches następna lekcja |

### Bezpieczeństwo

| Obszar | Implementacja |
|---|---|
| **Input validation** | `zod` na WSZYSTKICH API routes i Server Actions — brak `any`, pełne typy |
| **Rate limiting** | Upstash Ratelimit: `/api/auth/login` (5 req/min), `/admin/*` (10 req/min), cron endpoint (1 req/min) |
| **Security headers** | Next.js `headers()` config: HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin, Permissions-Policy |
| **CSP** | Content Security Policy: `default-src 'self'`, whitelist tylko znanych domen (Brevo, P24, Umami) |
| **CSRF** | NextAuth built-in CSRF token; Server Actions: CSRF protection out-of-the-box |
| **P24 webhook** | Weryfikacja `CRC` hash każdego callbacku przed przetworzeniem płatności |
| **SQL injection** | Prisma ORM: parametryzowane zapytania everywhere — zero raw SQL |
| **XSS** | React DOM escaping + `next/headers` CSP + `DOMPurify` dla user-generated content (opinie) |
| **Dependency audit** | `npm audit` + `snyk` w CI pipeline — blokuje deploy przy high/critical CVE |
| **Secrets** | Vercel Encrypted Env Variables; zero sekretów w kodzie; `.env.example` bez wartości |
| **Logs** | Brak logowania PII (email, imię) w logach aplikacyjnych; tylko anonymized user ID |
| **P24 sandbox isolation** | `PAYMENT_MODE` guard: mock/sandbox endpointy niedostępne na `production` build |
| **Admin IP Allowlist** | Fail-safe DENY: jeśli `ADMIN_ALLOWED_IPS` puste lub nieskonfigurowane → 403 ALL. Nigdy fail-open. (patrz Security Bug #6) |
| **Magic link — user enumeration** | Endpoint zawsze zwraca "Wysłaliśmy link" niezależnie od tego, czy email istnieje w DB (nie ujawniamy istnienia kont) |

### Przelewy24 Webhook Security (kluczowe)
```typescript
// app/api/payment/webhook/route.ts
import { createHash } from 'crypto';

function verifyP24Signature(body: P24Notification, crcKey: string): boolean {
  const expected = createHash('sha384')
    .update(`{"merchantId":${body.merchantId},"posId":${body.posId},"sessionId":"${body.sessionId}","amount":${body.amount},"originAmount":${body.originAmount},"currency":"${body.currency}","orderId":${body.orderId},"methodId":${body.methodId},"statement":"${body.statement}","crc":"${crcKey}"}`)
    .digest('hex');
  return expected === body.sign;
}
```
Każde powiadomienie o płatności bez poprawnego podpisu → 401, żaden dostęp do egzaminu nie jest przyznawany.

---

## 13f. Race Conditions — Identyfikacja i Obsługa

### Zidentyfikowane race conditions

| # | Scenariusz | Ryzyko | Fix |
|---|---|---|---|
| RC-1 | Podwójne wysłanie formularza egzaminu (double-click, network retry) | Dwa rekordy `ExamAttempt` dla jednej sesji → zdublowane wyniki | Idempotency key w URL: `/egzamin/[id]/submit?attempt=[uuid]` + DB UNIQUE(attemptId) |
| RC-2 | Webhook P24 wysłany 2× (retry timeout) | Dwa certyfikaty za 1 opłatę | Redis `SET NX EX 30` lock + DB UNIQUE(p24SessionId) + UNIQUE(userId, courseId) na cert |
| RC-3 | Streak update — 2 requesty w tej samej sekundzie | Streak incremented 2× | DB atomic: `UPDATE user SET streak = streak + 1 WHERE userId = ? AND DATE(lastActiveAt) < CURRENT_DATE` |
| RC-4 | Content update cron + admin approval w tym samym czasie | Konflikt nadpisania MDX pliku | Optimistic locking: `contentUpdate.version` field; przy merge sprawdź version matches |
| RC-5 | Jednoczesne zakupy tego samego egzaminu przez tego samego usera | Dwa rekordy Payment + dwa dostępy | DB UNIQUE(userId, courseId, status='ACTIVE') + Prisma transaction |
| RC-6 | Cache invalidation: użytkownik kończy lekcję gdy Redis cache jest czytany | Stary progress serwowany po update | `cache-aside pattern`: write-through + TTL 30s max na progress cache |

### Implementacja kluczowych fix-ów

```typescript
// RC-1: Idempotent exam submission
// RC-2: Payment idempotency (już w planie – Redis lock)

// RC-3: Atomic streak update (Prisma raw query)
await prisma.$executeRaw`
  UPDATE "User"
  SET "currentStreak" = "currentStreak" + 1,
      "lastActiveAt" = NOW()
  WHERE id = ${userId}
  AND DATE("lastActiveAt") < CURRENT_DATE
  AND DATE("lastActiveAt") >= CURRENT_DATE - INTERVAL '1 day'
`;
// Jeśli 0 rows affected → streak już zaktualizowany przez inny request

// RC-5: Atomic payment check + create
await prisma.$transaction(async (tx) => {
  const existing = await tx.payment.findFirst({
    where: { userId, courseId, status: 'ACTIVE' }
  });
  if (existing) throw new Error('Already purchased');
  return tx.payment.create({ data: { userId, courseId, ... } });
}, { isolationLevel: 'Serializable' });
```

---

## 13g. User Journey Diagrams

### Diagram 1: Ścieżki użytkownika (User Stories)

```
ANONIMOWY ODWIEDZAJĄCY
        │
        ▼
  [Landing Page neurova.pl]
        │
   ┌────┴────────────────────────────────┐
   │                                     │
   ▼                                     ▼
[Przeglądaj kursy]               [Czytaj blog / SEO]
   │                                     │
   ▼                                     │
[Lekcja 1-2 FREE]◄───────────────────────┘
   │
   ▼
[Content Gate: "Zapisz postęp — podaj email"]
   │ Komunikat: "Nie wymagamy hasła — wyślemy Ci link logowania"
   │ (art. 6.1.b RODO — usługa, NIE marketing consent)
   │
   ▼
["Sprawdź swoją skrzynkę email" ← ekran potwierdzenia z instrukcją]
   │
   ├──[Nie dostałeś emaila?] ──→ [Wyślij ponownie (max 3x/30min)] ←── Rate limit
   │
   ▼
[Magic Link w emailu (ważny 30 min)]
   │
   ├──[Brak kliknięcia w 30 min] ──→ [Token wygasa → user musi prosić nowy]
   │                                    Email reminder D+1: "Link wygasł — zaloguj się tu"
   │
   ▼
[Redirect → strona lekcji, gdzie user skończył]
[Token usunięty z DB natychmiast po kliknięciu — jednorazowy]
   │
   ▼
[Zalogowany — dostęp do reszty kursu]
   │
   ├──────────────────────────────────────┐
   ▼                                      ▼
[Nauka: lekcje 3-12]              [Dashboard: widok postępu]
   │                                      │
   ▼                                      │
[100% kursu]◄─────────────────────────────┘
   │
   ▼
[Kup dostęp do egzaminu]
   │
   ▼
[Checkout — Przelewy24]
   │
   ├── BLIK/przelew ──→ [P24 Sandbox/Live]
   │                          │
   │                    ┌─────┴──────┐
   │                    │            │
   │                 [SUCCESS]    [FAILED]
   │                    │            │
   │                    ▼            ▼
   │             [Dostęp do      [Błąd płatności
   │              egzaminu]       — spróbuj ponownie]
   │
   ▼
[Egzamin (60 pytań, 90 min)]
   │
   ├── Wynik ≥ 70% ──→ [CERTYFIKAT WYGENEROWANY]
   │                          │
   │                    ┌─────┴─────────────┐
   │                    ▼                   ▼
   │             [Pobierz PDF]      [Udostępnij LinkedIn]
   │                    │
   │                    ▼
   │             [Publiczna strona /certyfikat/[uuid]]
   │
   └── Wynik < 70% ──→ [Wynik + co poprawić]
                               │
                        [Retry (opłata ponowna)]

ZAREJESTROWANY USER (powrót):
  [Login] → [Dashboard]
      │
      ├──→ [Kontynuuj kurs]
      ├──→ [Moje certyfikaty]
      ├──→ [Mój profil / dane RODO]
      └──→ [Zmień zgody marketingowe]
```

### Diagram 2: Admin Panel Flow

```
ADMIN (PC-FIRST)
        │
        ▼
  [/admin/login]
        │
   [Hasło z managera haseł]
        │
   [2FA TOTP — Google Authenticator]
        │
   [IP Check — ADMIN_ALLOWED_IPS]
        │
        ▼
  [Admin Dashboard]
        │
   ┌────┼────────────────────────────────┐
   │    │                                │
   ▼    ▼                                ▼
[Treść] [Użytkownicy]             [Ustawienia]
   │         │                          │
   ├─[Aktualizacje AI - COURSE/EXAM]    ├─[Ceny egzaminów]
   │   │                                ├─[ADMIN_ALLOWED_IPS]
   │   ├─[Podgląd diffu]                └─[Prowiderzy: P24/AI/Email]
   │   ├─[Zatwierdź] → auto-update MDX
   │   └─[Odrzuć / Edytuj]
   │
   ├─[Blog: przegląd auto-opublikowanych]
   │   └─[Rollback jeśli błąd]
   │
   ├─[Polityka Prywatności: alerty RODO]
   │   └─[Zatwierdź zmiany po deploy]
   │
[Mailing]                         [Bezpieczeństwo]
   │                                    │
   ├─[Nowa kampania (WYSIWYG)]          ├─[Audit Log (kto co kiedy)]
   ├─[Subskrybenci + status zgody]      ├─[Security Events]
   ├─[Automation rules (Duolingo)]      └─[Failed login attempts]
   └─[Statystyki: open rate, CTR]

[Analityka Umami — embed w admin]
   └─[Traffic, top pages, conversions]
```

---

## 13h. Cookie Banner — Projekt UI/UX (GDPR-Compliant)

### Zasady UX (GDPR zgodność + conversions)
- **Nie ciemne wzorce**: wszystkie przyciski tej samej wielkości i kontrastu
- Pierwsze wejście: modal nie blokuje treści (slide-in od dołu)
- Jasny, prosty język polski
- Trzy przyciski tej samej wielkości: "Zaakceptuj wszystkie" | "Tylko niezbędne" | "Dostosuj"
- "Dostosuj" → accordion z kategoriami i opisem każdego cookie

### Komponenty

```tsx
// components/cookies/CookieBanner.tsx
// Pojawia się przy pierwszej wizycie (localStorage: 'cookie-consent' === undefined)

Layout:
┌─────────────────────────────────────────────────────┐
│ 🍪 Używamy plików cookie                            │
│                                                     │
│ Niezbędne do działania strony oraz opcjonalne        │
│ do analizy ruchu. Nie używamy cookies śledzących     │
│ bez Twojej zgody.                                   │
│                                                     │
│ [Tylko niezbędne]  [Dostosuj ▾]  [Zaakceptuj]      │
│                                                     │
│ Polityka Prywatności · Polityka Cookies             │
└─────────────────────────────────────────────────────┘

"Dostosuj" otwiera:
┌─────────────────────────────────────────────────────┐
│ ✅ Niezbędne (zawsze włączone)                       │
│    Sesja logowania, CSRF, język interfejsu           │
│                                                     │
│ ☐ Funkcjonalne                                       │
│    Przelewy24 redirect cookies (płatności)          │
│                                                     │
│ ☐ Marketingowe                                       │
│    Śledzenie kliknięć w emailach (Brevo)            │
│                                                     │
│              [Zapisz preferencje]                   │
└─────────────────────────────────────────────────────┘
```

### Synchronizacja z kodem
- `components/cookies/cookieConfig.ts` — lista aktywnych cookies generowana z `config/index.ts`
- Przy zmianie providera (P24 → Stripe): `policyChecker.ts` diff → alert w `/admin/settings/cookies`
- Consent zapisany: `localStorage['cookie-consent'] = { necessary: true, functional: false, marketing: false, timestamp: ISO8601 }`
- Serwer: cookie `__consent` (HttpOnly: false) dla SSR-based analytics guard

---

## Security Bug #7: Timing Attack na Magic Link Token

**Bug**: Porównanie tokenu magic link przez JavaScript `===` jest podatne na timing attacks. Atakujący może mierzyć czas odpowiedzi i stopniowo odgadnąć token.

**Scenariusz ataku**:
1. Magic link token: 64-znakowy hex string
2. Atakujący wysyła requesty z różnymi tokenami i mierzy czas odpowiedzi
3. Dłuższy czas = więcej pasujących znaków od początku (string comparison zatrzymuje się przy pierwszej różnicy)
4. Przy ~1000 requestach możliwe odgadnięcie tokenu bez dostępu do emaila

**Fix**: `crypto.timingSafeEqual()` — stały czas porównania:
```typescript
// lib/auth/magicLink.ts
import { timingSafeEqual, createHash, randomBytes } from 'crypto';

export function generateMagicToken(): string {
  return randomBytes(32).toString('hex'); // 64-char hex, 256-bit entropy
}

export function verifyMagicToken(submitted: string, stored: string): boolean {
  // Hash oba tokenów do stałej długości przed porównaniem
  const a = createHash('sha256').update(submitted).digest();
  const b = createHash('sha256').update(stored).digest();
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false; // timingSafeEqual throws if buffers have different length
  }
}
```

Token wygasa po 15 minutach (TTL w Redis lub DB). Jeden token = jedno użycie (usuwany po kliknięciu).

---

## Security Bug #8: Manipulacja zegarem klienta przedłuża czas egzaminu

**Bug**: Jeśli timer egzaminu jest odliczany client-side (JavaScript w przeglądarce), użytkownik może:
- Zmienić systemowy czas lokalny → timer "cofa się"
- Użyć DevTools do zatrzymania lub manipulacji timera
- Zablokować JavaScript i wydłużyć czas nielimitowanie

**Fix — Server-authoritative timer:**
```typescript
// Prisma schema:
// ExamAttempt {
//   id           String   @id @default(cuid())
//   userId       String
//   courseId     String
//   startedAt    DateTime @default(now())  ← zapisywane przez SERVER
//   submittedAt  DateTime?
//   answers      Json
//   score        Int?
//   examDurationMinutes Int @default(90)
// }

// app/api/exam/start/route.ts
const attempt = await prisma.examAttempt.create({
  data: { userId: session.user.id, courseId, startedAt: new Date() }  // SERVER timestamp
});

// app/api/exam/save-answer/route.ts (zapisuje postęp, sprawdza czas)
const attempt = await prisma.examAttempt.findUnique({ where: { id: attemptId } });
const elapsed = (Date.now() - attempt.startedAt.getTime()) / 1000 / 60; // minuty
if (elapsed > attempt.examDurationMinutes) {
  await autoSubmitExam(attempt); // auto-submit z dotychczasowymi odpowiedziami
  return new Response(JSON.stringify({ status: 'time_expired' }), { status: 200 });
}

// app/api/exam/submit/route.ts — ZAWSZE sprawdź czas przed akceptacją
const elapsed = (Date.now() - attempt.startedAt.getTime()) / 1000 / 60;
if (elapsed > attempt.examDurationMinutes + 2) { // +2 min grace period dla sieci
  return new Response('Time expired', { status: 400 });
}
```

**Frontend timer**: Wyświetla czas OBLICZONY Z SERWERA: `remainingSeconds = (attempt.examDurationMinutes * 60) - (serverNow - attempt.startedAt)`. Lokalny zegar nie jest używany do logiki — tylko do wyświetlania. Timer jest re-synchronizowany z serwerem co 60 sekund.

---

## 13i. Generowanie Zawartości przez AI — Pełny Zakres

### Co jest generowane przez AI

| Zasób | Model | Trigger | Przegląd człowieka |
|---|---|---|---|
| **Treści kursów** (MDX lekcji) | Deepseek R1 → Claude (humanizacja per persona) | Jednorazowo przy starcie + weekly update | TAK — admin panel |
| **Pytania egzaminacyjne** (bank pytań) | Deepseek R1 | Jednorazowo (150+ pytań per kurs) + weekly update | TAK — admin panel |
| **Odpowiedzi i wyjaśnienia** | Deepseek R1 | Wraz z pytaniami | TAK — admin panel |
| **Artykuły blogowe** | Deepseek R1 → Claude (humanizacja per persona) | 4×/tydzień (Pn/Śr Persona 1, Wt/Czw Persona 2) | NIE (auto) |
| **Opisy kursów** (SEO) | Claude Sonnet | Jednorazowo | TAK — admin |
| **FAQ pages** | Deepseek R1 | Jednorazowo + quarterly update | TAK — admin |
| **Glossary of terms** | Deepseek R1 | Jednorazowo | NIE (niskie ryzyko) |
| **Biogramy person autorów** | DALL-E/MJ (ilustracje semi-flat) + Claude (bio) | Jednorazowo | TAK |
| **Posty jako Persona 1 / Persona 2** | Deepseek R1 → Claude | Weekly | NIE (auto) |

### Generowanie bazy pytań (przykład dla kursu AI)
```
Prompt: "Wygeneruj 20 pytań wielokrotnego wyboru (4 opcje, 1 poprawna) 
na temat [moduł X] dla egzaminu Neurova AI Academy. Poziom: średnio-zaawansowany.
Pytania muszą testować praktyczne rozumienie, nie zapamiętywanie definicji.
Odpowiedź: JSON { question, options: [A,B,C,D], correct: 'B', explanation: '...' }
Język: polski (terminy techniczne w oryginale angielskim)."
```

Bank pytań: min. 150 pytań per kurs → każdy egzamin losuje 60 pytań (nie tych samych za każdym razem).

---

## 13j. Weryfikacja Spójności Architektury

### Czy wszystkie rozwiązania mają sens? ✅ Analiza

| Komponent | Ocena | Uwagi |
|---|---|---|
| Next.js 14+ App Router | ✅ | Industry standard, najlepsza kombinacja SSG/SSR/ISR |
| TypeScript | ✅ | Niezbędne dla projektu tej skali |
| Tailwind CSS + shadcn/ui | ✅ | Szybki DX, dostępność WCAG 2.1 built-in |
| Prisma + PostgreSQL | ✅ | Type-safe ORM, relacyjna DB właściwa dla tego modelu danych |
| NextAuth.js v5 + magic links | ✅ | Modern, friction-less auth. Magic links = mobile-friendly |
| Przelewy24 | ✅ | Najlepszy wybór dla polskiego rynku |
| Brevo | ✅ | EU GDPR-compliant, automation w free tier |
| Umami self-hosted | ✅ | Zero cookies, zero compliance overhead, zero cost |
| MDX + Contentlayer | ✅ | Versionable content, type-safe, developer-friendly |
| Redis (Upstash) | ✅ | Serverless Redis, kompatybilny z Vercel Edge |
| Playwright | ✅ | Industry standard E2E |
| PWA (next-pwa) | ✅ | Kompatybilny z App Router od v5.6 |
| **Deepseek R1 0528 lokalnie** | ✅ | Maszyna dedykowana w sieci lokalnej (192.168.0.180) — ograniczenia VRAM nie obowiązują. Użyj modelu R1 0528 (pełny lub odpowiedni wariant zależnie od konfiguracji sprzętu serwera). |
| **Qwen3 8B** | ✅ | 8B = uruchomi się na 8GB+ VRAM. Dobry dla zadań pomocniczych |
| Vercel + Supabase | ✅ | Frankfurt EU region, GDPR-friendly |
| Docker Compose (dev) | ✅ | Identyczne środowisko dev/prod — łatwe przeniesienie |

### Korekta: Deepseek R1 w LM Studio
```
# W LM Studio pobierz jeden z:
- deepseek-r1-distill-qwen-7b     (wymaga ~8GB VRAM)
- deepseek-r1-distill-llama-8b    (wymaga ~8GB VRAM)  
- deepseek-r1-distill-qwen-14b    (wymaga ~12GB VRAM)

# .env.local
AI_LOCAL_MODEL=deepseek-r1-distill-qwen-7b  # dokładna nazwa z LM Studio
```

---

## 13k. Admin Config Panel — Wszystkie Ustawienia w Jednym Miejscu

Panel admina oferuje dwa poziomy konfiguracji:

### Poziom 1: Runtime Config (bez deployu, zmiany natychmiastowe)
Przechowywany w tabeli DB `AdminSettings { key: String @unique, value: String, updatedAt: DateTime }`:

```
/admin/settings/
├── general/       Nazwa platformy, email kontaktowy, logo URL
├── pricing/       Ceny egzaminów per kurs, kody promocyjne
├── ai/            Aktywny model AI, temperatury, max tokens per zadanie
├── email/         Brevo API key, From name/address, szablony  
├── notifications/ Trigger timings (Duolingo automation delays)
└── content/       Próg zmiany tygodniowej (max %)
```

### Poziom 2: Deploy Config (wymaga re-deploy Vercel)
Konfigurowany przez Vercel Environment Variables (UI Vercel dashboard):

```
Hosting:           DATABASE_URL, NEXTAUTH_URL, NEXT_PUBLIC_SITE_URL
AI Provider:       AI_CONTENT_PROVIDER, DEEPSEEK_API_KEY, AI_LOCAL_URL
Email Provider:    EMAIL_PROVIDER, BREVO_API_KEY
Analytics:         ANALYTICS_PROVIDER, UMAMI_WEBSITE_ID
Payment:           PAYMENT_PROVIDER, PAYMENT_MODE, P24_MERCHANT_ID
Security:          NEXTAUTH_SECRET, CRON_SECRET, ADMIN_ALLOWED_IPS
```

> Admin widzi obie sekcje w panelu. Przy próbie zmiany Deploy Config — wyświetlana jest instrukcja: "Zmień tę wartość w Vercel Dashboard → Ustawienia → Zmienne Środowiskowe → Trigger redeploy"

### Kluczowy plik — `lib/adminSettings.ts`
```typescript
// Cache runtime settings w Redis (TTL: 5 min)
export async function getSetting(key: string): Promise<string | null> {
  const cached = await redis.get(`admin_setting:${key}`);
  if (cached) return cached;
  const setting = await prisma.adminSettings.findUnique({ where: { key } });
  if (setting) await redis.setex(`admin_setting:${key}`, 300, setting.value);
  return setting?.value ?? null;
}
```

---

## 13l. Test → Live — Strategia Przełączenia (Uproszczona)

Cały projekt jest zbudowany ENV-first: zmiana środowiska = zmiana zmiennych ENV.

### Różnice Dev vs. Live

| Aspekt | Dev (lokalnie) | Live (Vercel/Supabase) |
|---|---|---|
| Płatności | `PAYMENT_MODE=mock` lub `sandbox` | `PAYMENT_MODE=live` |
| AI | `AI_CONTENT_PROVIDER=local`, `AI_LOCAL_URL=http://192.168.0.180:1234` | `AI_CONTENT_PROVIDER=deepseek-api` |
| Baza danych | `DATABASE_URL=postgresql://postgres:password@localhost:5432/neurova` | `DATABASE_URL=postgresql://[supabase-url]` |
| Email | `EMAIL_PROVIDER=brevo`, `BREVO_API_KEY=sandbox-key` | `BREVO_API_KEY=production-key` |
| Admin IP | `ADMIN_ALLOWED_IPS=127.0.0.1` | `ADMIN_ALLOWED_IPS=<twoje-publiczne-IP>` |
| Cron | `node-cron` lokalnie | Vercel Cron Jobs |
| Analytics | Umami lokalnie (Docker) | Umami na Vercel |

### Checklist: Dev → Live (15 kroków)
```
□ 1. Vercel: Ustaw wszystkie ENV vars (Vercel Dashboard)
□ 2. Supabase: Utwórz projekt EU-Frankfurt → skopiuj DATABASE_URL
□ 3. `npx prisma migrate deploy` → Supabase (migracja produkcyjna)
□ 4. Supabase: Ustaw Row Level Security (RLS) — patrz prisma/rls.sql
□ 5. Przelewy24: Zarejestruj domenę neurova.pl, pobierz Merchant ID + API Key
□ 6. Przelewy24: Ustaw webhook URL: https://neurova.pl/api/payment/webhook
□ 7. Brevo: Zweryfikuj domenę neurova.pl (SPF/DKIM records)
□ 8. Upstash: Utwórz Redis instance EU-Frankfurt → skopiuj URL
□ 9. Umami: Deploy na Vercel (osobny projekt) → skopiuj Website ID
□ 10. ADMIN_ALLOWED_IPS: Ustaw swoje publiczne IP
□ 11. NEXTAUTH_SECRET: `openssl rand -hex 32` → wklej do Vercel
□ 12. CRON_SECRET: `openssl rand -hex 32` → wklej do Vercel
□ 13. Weryfikacja: `npm run build` bez błędów
□ 14. Deploy na Vercel: `git push main` → auto-deploy
□ 15. Płatność testowa (Przelewy24 prod z kartą testową) → certyfikat wygenerowany
```

---

## 13m. Regulamin — Dynamiczne Aktualizacje (Prawo PL)

**Podstawa prawna**: Ustawa o świadczeniu usług drogą elektroniczną (art. 8 ust. 3) + Kodeks Cywilny.

Wymagania:
- Zmiana regulaminu → użytkownicy muszą być powiadomieni **co najmniej 14 dni przed wejściem w życie**
- Prawo do rezygnacji przed wejściem zmian w życie
- Brak sprzeciwu = akceptacja zmian

**Mechanizm synchronizacji regulaminu z aplikacją:**

```typescript
// Prisma schema:
// TermsVersion {
//   id          String   @id @default(cuid())
//   version     String   @unique  // "1.0", "1.1", "2.0"
//   content     String   // MDX content
//   publishedAt DateTime @default(now())
//   effectiveAt DateTime // publishedAt + 14 days
//   changeLog   String   // co się zmieniło (dla userów)
//   providers   Json     // { payment: "przelewy24", ai: "deepseek" }
// }
//
// User {
//   acceptedTermsVersion String  // "1.0"
// }

// lib/terms/termsSync.ts
// Trigger: zmiana PAYMENT_PROVIDER lub EMAIL_PROVIDER w config
export async function checkTermsSync(currentConfig: Config) {
  const latestTerms = await getLatestTerms();
  const configProviders = { payment: currentConfig.payment.provider, email: currentConfig.email.provider };
  
  if (JSON.stringify(latestTerms.providers) !== JSON.stringify(configProviders)) {
    // Utwórz nową wersję regulaminu
    const newTerms = await createTermsVersion({
      content: await generateTermsContent(configProviders), // AI-generated from template
      effectiveAt: addDays(new Date(), 14),
      changeLog: `Zmiana dostawcy płatności: ${latestTerms.providers.payment} → ${configProviders.payment}`,
      providers: configProviders,
    });
    
    // Wyślij powiadomienie do wszystkich aktywnych użytkowników
    await notifyUsersOfTermsChange(newTerms);
  }
}

// Middleware: przed zakupem sprawdź, czy user zaakceptował aktualny regulamin
async function requireCurrentTerms(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const currentTerms = await getEffectiveTerms();
  if (user.acceptedTermsVersion !== currentTerms.version) {
    throw new Error('TERMS_OUTDATED'); // → redirect do /akceptacja-regulaminu
  }
}
```

**Email notyfikacyjny** (przez Brevo, transakcyjny — bez wymogu zgody marketingowej):
```
Temat: Zmiana Regulaminu Neurova AI Academy — wejdzie w życie [data]
Treść: 
  Co się zmienia: [changeLog]
  Kiedy: [effectiveAt]
  Jeśli nie chcesz zaakceptować: usuń konto przed [effectiveAt]
  Nowy regulamin: https://neurova.pl/regulamin/[version]
```

---

## Security Bug #9 (KRYTYCZNY): Mass Data Exposure przez niezabezpieczone Prisma `include`

**Bug**: Użycie `include: { user: true }` bez `select` w zapytaniach Prisma zwraca **wszystkie pola użytkownika** — w tym zahashowane hasła, emaile, daty urodzin, zgody RODO, historia płatności — dla każdego powiązanego rekordu.

**Scenariusz ataku**:
1. API endpoint: `GET /api/certificates?courseId=xyz` — lista certyfikatów kursu
2. Kod: `prisma.certificate.findMany({ include: { user: true } })` 
3. Odpowiedź zawiera: `user.email`, `user.passwordHash`, `user.marketingConsentIp`, `user.paymentHistory` — dla WSZYSTKICH właścicieli certyfikatów
4. Jeśli ten endpoint jest publiczny (do weryfikacji certyfikatów): **masowy wyciek danych WSZYSTKICH użytkowników** → GDPR breach, kara do 4% rocznego obrotu

**Dlaczego KRYTYCZNE**: Jeden błąd kodu → eksponuje bazę wszystkich użytkowników. Łatwy do przeoczenia podczas code review.

**Fix: Zawsze używaj `select` przy `include`**:
```typescript
// ❌ NIEBEZPIECZNE — nigdy tak:
const certs = await prisma.certificate.findMany({
  include: { user: true }
});

// ✅ BEZPIECZNE — zawsze tak:
const certs = await prisma.certificate.findMany({
  select: {
    id: true,
    courseId: true,
    issuedAt: true,
    user: {
      select: {
        name: true,
        // NIGDY: email, passwordHash, marketingConsent*, createdAt
      }
    }
  }
});

// Lub użyj Prisma `omit` na poziomie modelu (Prisma 5.13+):
// prisma/schema.prisma
// model User {
//   passwordHash  String  @omit
// }
```

**Globalne zabezpieczenie**: Stworzyć dedykowane "DTO selects" dla każdego modelu:
```typescript
// lib/prisma/selects.ts
export const userPublicSelect = { name: true } as const;
export const userDashboardSelect = { name: true, email: true, currentStreak: true } as const;
// NIGDY: `user: true` w production queries
```

**CI/CD Guard**: ESLint rule `no-prisma-include-without-select` — blokuje `include: { [\w]+: true }` bez `select`.

---

## 14. Verification

```bash
# Local development
docker-compose up -d        # PostgreSQL + Redis
npm run dev                 # http://localhost:3000

# Automated tests
npx playwright test         # 25 E2E tests
npm run test                # Jest unit tests

# Build verification
npm run build               # No TS errors, no build failures
npm run lint                # ESLint pass

# Performance
npx lighthouse http://localhost:3000 --view  # Target: >90 all categories

# SEO
# → Google Rich Results Test (JSON-LD)
# → securityheaders.com (security headers)
# → PageSpeed Insights: https://pagespeed.web.dev/ — target: 99% mobile (blokuje deploy jeśli niżej)
```

---

## Decyzje Właściciela (Potwierdzone)

| # | Temat | Decyzja |
|---|---|---|
| 1 | **Cena egzaminu** | Konfigurowalna z panelu admin (bez hardcodu — właściciel ustawia cenę samodzielnie bez zmiany kodu) |
| 2 | **Content updates** | **Hybrid**: Blog/SEO artykuły → fully automatic; Treści kursów + pytania egzaminacyjne → admin panel do weryfikacji (zgodnie z korektą właściciela) |
| 3 | **Platforma produkcyjna** | **Vercel + Supabase** — Next.js na Vercel, PostgreSQL na Supabase (EU region Frankfurt), Redis na Upstash |

### Konsekwencje decyzji "Fully automatic":

Ponieważ aktualizacje publikują się bez przeglądu człowieka, pipeline musi zawierać dodatkowe zabezpieczenia:
```
Claude API → Walidacja (second pass: "Czy ta zmiana jest merytorycznie poprawna?") 
→ Diff size check (max 20% zmiany per moduł jednorazowo, inaczej HOLD)
→ Auto-publish z flagą [AI-UPDATED: 2025-01-xx]
→ Pełny log w DB (ContentUpdateLog) z możliwością rollback jednym kliknięciem w admin panelu
→ Email/Slack notification do właściciela po każdej auto-aktualizacji
```

### Konsekwencje decyzji "Cena konfigurowalna":

Dodać do `admin/settings/pricing` — panel gdzie właściciel ustawia:
- Cena za podejście do egzaminu (PLN)
- Liczba darmowych podejść (0 = zawsze płatne)
- Zniżki (kod promocyjny)
- Stripe Price ID (auto-aktualizowany przez webhook)

---

## 16. Przewodnik Uruchamiania — Krok po Kroku (dla osoby robiącej to pierwszy raz)

### CZĘŚĆ A: Środowisko Testowe (lokalnie na Twoim komputerze)

#### Wymagania wstępne — zainstaluj raz
```
□ Node.js 20+ → https://nodejs.org → pobierz "LTS" → zainstaluj → sprawdź: node --version
□ Docker Desktop → https://www.docker.com/products/docker-desktop → zainstaluj → uruchom
□ Git → https://git-scm.com → zainstaluj
□ VS Code (opcjonalnie) → https://code.visualstudio.com
```

#### Krok 1: Pobierz projekt
```bash
# Otwórz terminal (Windows: kliknij Start → wpisz "cmd" lub "PowerShell")
cd c:\repo\elarningAI

# Zainstaluj wszystkie zależności (pobierze ~500 MB — poczekaj)
npm install
```

#### Krok 2: Skonfiguruj zmienne środowiskowe
```bash
# Skopiuj przykładowy plik konfiguracyjny
copy .env.example .env.local

# Otwórz .env.local w edytorze tekstowym i uzupełnij:
# - NEXTAUTH_SECRET → wklej wynik: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# - CRON_SECRET     → wklej wynik: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# - ADMIN_ALLOWED_IPS=127.0.0.1
# - PAYMENT_MODE=mock
# - AI_LOCAL_URL=http://192.168.0.180:1234
# Pozostałe klucze API możesz uzupełnić później
```

#### Krok 3: Uruchom bazę danych i Redis (Docker)
```bash
# Upewnij się że Docker Desktop jest uruchomiony (ikona wieloryba w zasobniku)
docker-compose up -d

# Sprawdź czy kontenery działają (powinieneś zobaczyć "neurova-postgres" i "neurova-redis" jako "running")
docker-compose ps
```

#### Krok 4: Utwórz tabele w bazie danych
```bash
# Uruchom migracje (tworzy wszystkie tabele w PostgreSQL)
npx prisma migrate dev --name init

# Wypełnij bazę danymi testowymi (seed — tworzy 2 kursy, pytania, przykładowego admina)
npx prisma db seed
```

#### Krok 5: Uruchom aplikację
```bash
npm run dev

# Po chwili zobaczysz:
# ✓ Ready on http://localhost:3000
#
# Otwórz przeglądarkę i wejdź na: http://localhost:3000
```

#### Krok 6: Sprawdź czy działa
```
□ http://localhost:3000           → strona główna widoczna
□ http://localhost:3000/kursy     → lista kursów
□ http://localhost:3000/logowanie → formularz logowania
□ http://localhost:3000/admin     → powinno zwrócić 403 (dopóki nie skonfigurujesz IP)
```

#### Zatrzymywanie środowiska testowego
```bash
# Zatrzymaj aplikację: Ctrl+C w terminalu z "npm run dev"
# Zatrzymaj Docker:
docker-compose down
# Następnym razem wystarczy: docker-compose up -d → npm run dev
```

---

### CZĘŚĆ B: Testy Automatyczne (Playwright + Jest)

#### Krok 1: Upewnij się że aplikacja działa
```bash
# W oddzielnym terminalu (nie zamykaj poprzedniego z npm run dev):
docker-compose up -d   # jeśli nie jest uruchomiony
npm run dev            # jeśli nie jest uruchomiony
```

#### Krok 2: Zainstaluj przeglądarki dla Playwright (tylko raz, ~200 MB)
```bash
npx playwright install
```

#### Krok 3: Uruchom testy E2E (Playwright — 25 testów user stories)
```bash
# Wszystkie testy (uruchamia przeglądarkę w tle)
npx playwright test

# Testy z widoczną przeglądarką (zobaczysz co robi):
npx playwright test --headed

# Tylko jeden plik testowy:
npx playwright test tests/auth/01-registration.spec.ts --headed

# Konkretna kategoria:
npx playwright test tests/courses/ --headed

# Po testach — otwórz raport HTML:
npx playwright show-report
# → Otwiera się przeglądarka z kolorowym raportem: zielone = ok, czerwone = błąd
```

#### Krok 4: Uruchom testy jednostkowe (Jest)
```bash
# Wszystkie testy jednostkowe
npm run test

# Tryb watch (re-uruchamia przy każdej zmianie kodu — przydatne przy pisaniu kodu):
npm run test -- --watch

# Jeden konkretny plik:
npm run test -- lib/auth/magicLink.test.ts

# Z pokryciem kodu (coverage):
npm run test -- --coverage
# Otwórz coverage/index.html w przeglądarce żeby zobaczyć który kod jest przetestowany
```

#### Krok 5: Pełna weryfikacja przed deployem
```bash
npm run lint          # sprawdza styl kodu (powinno być 0 błędów)
npm run build         # buduje produkcyjną wersję (sprawdza TypeScript — powinno być 0 błędów)
npx playwright test   # wszystkie 25 testów E2E
npm run test          # wszystkie testy jednostkowe
```

---

### CZĘŚĆ C: Testy Manualne (wykonujesz sam w przeglądarce)

> Wykonaj poniższe testy po kolei. Aplikacja musi być uruchomiona (`npm run dev`).

#### Blok 1: Rejestracja i logowanie
```
□ M1-1. Wejdź na http://localhost:3000/rejestracja
         → Wypełnij imię, email (użyj prawdziwego — dostaniesz email)
         → Zaznacz wymagane checkboxy (Regulamin, Wiek)
         → Kliknij "Zarejestruj się"
         → Sprawdź: pojawił się komunikat "Sprawdź swoją skrzynkę email"

□ M1-2. Otwórz skrzynkę email → kliknij link logowania
         → Sprawdź: zostałeś przekierowany do panelu użytkownika

□ M1-3. Wyloguj się (przycisk w menu)
         → Sprawdź: wróciłeś na stronę główną, nie widzisz "Panel"
```

#### Blok 2: Przeglądanie kursu
```
□ M2-1. Wejdź na /kursy → kliknij "Analityka Danych"
         → Sprawdź: opis kursu, lista modułów, przycisk "Rozpocznij"

□ M2-2. Kliknij pierwszą lekcję
         → Sprawdź: treść lekcji widoczna BEZ logowania

□ M2-3. Kliknij trzecią lekcję w module
         → Sprawdź: pojawia się formularz "Zapisz postęp — podaj email"

□ M2-4. Zaloguj się przez magic link
         → Sprawdź: lekcja jest teraz dostępna, postęp zapisany
```

#### Blok 3: Płatność i egzamin (tryb mock)
```
□ M3-1. Ukończ wszystkie lekcje kursu (możesz kliknąć "Oznacz jako ukończone")
         → Sprawdź: pojawia się przycisk "Kup dostęp do egzaminu — 249 PLN"

□ M3-2. Kliknij "Kup" → jesteś w trybie PAYMENT_MODE=mock
         → Sprawdź: pojawia się przycisk "Symuluj płatność" (nie ma prawdziwej strony P24)
         → Kliknij "Symuluj płatność"
         → Sprawdź: dostałeś dostęp do egzaminu

□ M3-3. Rozpocznij egzamin
         → Sprawdź: widoczny timer, jedno pytanie na raz (mobile) lub lista (desktop)
         → Odpowiedz na 5 pytań → kliknij "Zakończ"
         → Sprawdź: widzisz wynik (np. "2/5 — nie zdałeś, próg to 70%")
```

#### Blok 4: Certyfikat
```
□ M4-1. Odpowiedz poprawnie na 70%+ pytań (lub ustaw w seedzie wynik testowy)
         → Sprawdź: "Gratulacje! Certyfikat wygenerowany"

□ M4-2. Kliknij "Pobierz PDF"
         → Sprawdź: pobiera się plik PDF z Twoim imieniem, datą, logo Neurova

□ M4-3. Kliknij "Udostępnij na LinkedIn"
         → Sprawdź: otwiera się LinkedIn z wypełnionymi polami certyfikatu

□ M4-4. Skopiuj URL certyfikatu (np. /certyfikat/abc-123-uuid)
         → Otwórz w trybie incognito (bez logowania)
         → Sprawdź: widzisz imię, kurs, datę — ale NIE email, NIE ID użytkownika
```

#### Blok 5: Responsywność mobilna
```
□ M5-1. W Chrome: kliknij F12 → ikonka telefonu (Toggle device toolbar)
         → Wybierz "iPhone SE" (375px)
         → Sprawdź: dolne menu nawigacji zamiast hamburgera
         → Sprawdź: tekst czytelny, przyciski dotykalne (min. 44px)

□ M5-2. Wybierz "iPad" (768px)
         → Sprawdź: layout dwukolumnowy

□ M5-3. Wróć do desktop (1280px)
         → Sprawdź: sidebar + treść obok siebie
```

#### Blok 6: SEO i dostępność
```
□ M6-1. Kliknij prawym na stronie → "Pokaż źródło strony"
         → Szukaj: <html lang="pl"> ✓
         → Szukaj: <title>...</title> ✓
         → Szukaj: "application/ld+json" (JSON-LD structured data) ✓

□ M6-2. W Chrome: F12 → zakładka "Lighthouse"
         → Kliknij "Analyze page load"
         → Cel: Performance > 90, Accessibility > 90, SEO > 90

□ M6-3. Cookie banner:
         → Otwórz stronę w trybie incognito
         → Sprawdź: widoczny banner cookie na dole
         → Kliknij "Tylko niezbędne" → banner znikł
         → Odśwież stronę → banner nie pojawia się ponownie ✓
```

#### Blok 7: Panel admina
```
□ M7-1. Dodaj swoje IP do ADMIN_ALLOWED_IPS w .env.local
         (Twoje IP: wejdź na https://whatismyip.com — skopiuj numer)
         → Zrestartuj: Ctrl+C → npm run dev

□ M7-2. Wejdź na http://localhost:3000/admin
         → Zaloguj się kontem admina (z seed danych)
         → Sprawdź: widzisz dashboard, menu "Aktualizacje", "Ustawienia"

□ M7-3. Wejdź na /admin/aktualizacje
         → Sprawdź: lista propozycji aktualizacji treści (jeśli cron był uruchomiony)

□ M7-4. Wejdź na /admin/settings/pricing
         → Zmień cenę egzaminu → Zapisz
         → Wróć na stronę kursu → sprawdź czy cena się zmieniła
```

#### Blok 8: RODO
```
□ M8-1. Zaloguj się → wejdź na /panel/profil
         → Sprawdź: przycisk "Pobierz moje dane (JSON)"
         → Kliknij → pobiera się plik JSON z Twoimi danymi

□ M8-2. Sprawdź: przycisk "Usuń moje konto"
         → Kliknij → pojawia się potwierdzenie "Czy na pewno?"
         → Potwierdź → konto usunięte (anonimizacja), przekierowanie na stronę główną
```

---

### CZĘŚĆ D: Uruchomienie na Live (Produkcja)

> ⚠️ Przed deployem produkcyjnym musisz mieć gotowe wszystkie zewnętrzne konta (Vercel, Supabase, Przelewy24, Brevo, Upstash). Wykonaj kroki poniżej po kolei — każdy krok ma link i wyjaśnienie co zrobić.

#### Krok 1: Supabase — baza danych produkcyjna
```
1. Wejdź na https://supabase.com → Zaloguj się lub utwórz konto
2. Kliknij "New project"
3. Nazwa: "neurova-production"
4. Region: "eu-central-1" (Frankfurt) ← WAŻNE dla GDPR
5. Hasło do bazy: wygeneruj silne hasło i zapisz w menedżerze haseł
6. Kliknij "Create new project" → poczekaj 2 minuty
7. Wejdź w: Settings → Database → Connection string → "URI"
   Skopiuj całe "postgres://..." → to jest Twój DATABASE_URL
```

#### Krok 2: Upstash — Redis produkcyjny
```
1. Wejdź na https://upstash.com → utwórz konto
2. "Create database" → Region: "eu-west-1" (Ireland) lub "eu-central-1"
3. Skopiuj "UPSTASH_REDIS_REST_URL" i "UPSTASH_REDIS_REST_TOKEN"
```

#### Krok 3: Vercel — hosting
```
1. Wejdź na https://vercel.com → zaloguj się przez GitHub
2. Kliknij "Add New Project" → wybierz repozytorium "elarningAI"
3. Framework: "Next.js" (wykryty automatycznie)
4. NIE klikaj "Deploy" jeszcze — najpierw ustaw zmienne środowiskowe
5. Kliknij "Environment Variables" i dodaj jedną po drugiej:
   (wszystkie zmienne z .env.example, z prawdziwymi wartościami)

   Wymagane na start:
   NEXTAUTH_URL          = https://neurova.pl
   NEXTAUTH_SECRET       = [uruchom: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
   DATABASE_URL          = [z Supabase — krok 1]
   UPSTASH_REDIS_REST_URL    = [z Upstash — krok 2]
   UPSTASH_REDIS_REST_TOKEN  = [z Upstash — krok 2]
   PAYMENT_MODE          = live
   PAYMENT_PROVIDER      = przelewy24
   P24_MERCHANT_ID       = [z panelu Przelewy24]
   P24_API_KEY           = [z panelu Przelewy24]
   P24_CRC_KEY           = [z panelu Przelewy24]
   BREVO_API_KEY         = [z panelu Brevo]
   ADMIN_ALLOWED_IPS     = [Twój publiczny adres IP z https://whatismyip.com]
   CRON_SECRET           = [uruchom: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
   AI_CONTENT_PROVIDER   = deepseek-api
   DEEPSEEK_API_KEY      = [z https://platform.deepseek.com]
   ANTHROPIC_API_KEY     = [z https://console.anthropic.com]
   NEXT_PUBLIC_SITE_URL  = https://neurova.pl

6. Kliknij "Deploy" → Vercel buduje i deployuje (~3 minuty)
7. Twoja aplikacja jest dostępna pod adresem: https://[nazwa-projektu].vercel.app
```

#### Krok 4: Uruchom migracje na produkcyjnej bazie danych
```bash
# Na swoim komputerze, w folderze projektu:
# Ustaw tymczasowo DATABASE_URL na produkcyjny (z Supabase):
# Windows PowerShell:
$env:DATABASE_URL="postgres://[twoj-supabase-url]"

# Uruchom migracje (tworzy tabele w produkcyjnej bazie):
npx prisma migrate deploy

# Sprawdź czy tabele istnieją:
npx prisma studio
# → Otwiera się przeglądarka z widokiem bazy danych
```

#### Krok 5: Przelewy24 — konfiguracja webhooka
```
1. Zaloguj się na https://panel.przelewy24.pl
2. Wejdź w: Ustawienia → Adresy IP i URL → URL do powiadomień
3. Wpisz: https://neurova.pl/api/payment/webhook
4. Zapisz
5. Zrób transakcję testową (P24 ma tryb testowy w panelu)
   → Sprawdź logi Vercel: Functions → /api/payment/webhook
   → Powinna pojawić się transakcja z status 200
```

#### Krok 6: Brevo — weryfikacja domeny (emaile)
```
1. Zaloguj się na https://app.brevo.com
2. Wejdź w: Senders & IP → Domains → Add a domain
3. Wpisz: neurova.pl
4. Brevo pokaże Ci rekordy DNS do dodania:
   SPF:   TXT  neurova.pl  "v=spf1 include:spf.brevo.com ~all"
   DKIM:  TXT  [selector]._domainkey.neurova.pl  [klucz]
5. Dodaj te rekordy w panelu DNS swojej domeny (OVH/Cloudflare/nazwa.pl itd.)
6. Wróć do Brevo → kliknij "Verify" → poczekaj do 24h na propagację DNS
7. Po weryfikacji: przetestuj email — wyślij magic link testowy
```

#### Krok 7: Podpięcie własnej domeny neurova.pl
```
1. W panelu Vercel → Settings → Domains → Add domain
2. Wpisz: neurova.pl
3. Vercel pokaże rekordy DNS do dodania:
   A    neurova.pl    76.76.21.21
   lub
   CNAME  www.neurova.pl   cname.vercel-dns.com
4. Dodaj rekordy w panelu swojego rejestratora domeny
5. Poczekaj max 48h → Vercel automatycznie wyda certyfikat SSL (HTTPS)
6. Sprawdź: https://neurova.pl → Twoja strona działa z kłódką HTTPS ✓
```

#### Krok 8: Weryfikacja produkcji (uruchom po deploymencie)
```
□ https://neurova.pl → strona główna ładuje się < 3 sekundy
□ https://neurova.pl/kursy → lista kursów widoczna
□ Magic link: zarejestruj się → sprawdź email → zaloguj się ✓
□ Płatność Przelewy24: kup egzamin kartą testową 4242... (tryb sandbox P24)
   → certyfikat wygenerowany ✓
□ https://neurova.pl/admin → 403 dla obcych IP ✓
□ Twoje IP → panel admina dostępny po 2FA ✓
□ https://search.google.com/test/rich-results?url=https://neurova.pl → JSON-LD OK ✓
□ https://securityheaders.com/?q=neurova.pl → ocena A lub A+ ✓
□ https://pagespeed.web.dev/ → Performance = **99% mobile** ✓ (jeśli < 99%: diagnozuj metrykę → fix → redeploy → sprawdź ponownie)
```

#### Krok 9: Monitorowanie po uruchomieniu
```
Vercel Dashboard → Functions → sprawdzaj błędy 500 codziennie przez pierwszy tydzień
Supabase → Database → sprawdzaj rozmiar bazy (free tier: 500 MB)
Umami (analytics): https://[twoj-umami].vercel.app → ruch, konwersje
Brevo: panel → sprawdzaj delivery rate emaili (cel: > 95%)
Przelewy24: panel → historia transakcji → porównaj z DB
```

---

## 17. Analiza Jakościowa — Zidentyfikowane Luki i Poprawki

---

### 17a. Feedback Loop — Weryfikacja Poprawności Odpowiedzi Egzaminacyjnych

**Problem**: AI generuje pytania i zaznacza poprawną odpowiedź. Nikt nie gwarantuje, że zaznaczona odpowiedź jest faktycznie poprawna. Jeden błąd merytoryczny w egzaminie = nieuczciwość wobec użytkownika + ryzyko reputacyjny.

**Trójwarstwowy mechanizm weryfikacji:**

```
WARSTWA 1 — Cross-model validation (przy generowaniu):
  Model A (Deepseek R1): generuje pytanie + 4 opcje + zaznacza poprawną
  Model B (Claude Haiku): dostaje to samo pytanie BEZ zaznaczonej odpowiedzi
                           → odpowiada samodzielnie
  Porównanie: jeśli Model B wskazuje inną odpowiedź → FLAG: NEEDS_REVIEW
  Jeśli zgoda → pytanie idzie do puli PENDING_REVIEW (admin akceptuje finalnie)

WARSTWA 2 — Admin review (obowiązkowy przed publikacją):
  Admin widzi w panelu: pytanie + odpowiedzi + wyniki obu modeli
  Przy niezgodności: podświetlone ostrzeżenie "Modele się nie zgadzają"
  Admin: zatwierdź / edytuj poprawną odpowiedź / odrzuć pytanie

WARSTWA 3 — Statystyczna weryfikacja post-launch (sygnał behawioralny):
  Cron: sprawdza co tydzień pytania, gdzie >= 75% użytkowników wybiera opcję inną niż "poprawna"
  → automatyczna flaga w panelu admina: "Podejrzane pytanie — sprawdź odpowiedź"
  Przykład: jeśli 82% uczestników wybiera opcję B, a C jest zaznaczona jako poprawna
            → prawdopodobnie C jest błędna lub pytanie jest niejasne
```

**Implementacja:**
```typescript
// lib/cron/examQA.ts
// Uruchamiane przy każdym wygenerowaniu pytania:
async function crossValidateQuestion(question: GeneratedQuestion): Promise<QAResult> {
  const claudeAnswer = await askClaudeHaiku(question.text, question.options); // bez poprawnej
  return {
    deepseekAnswer: question.correctOption,
    claudeAnswer,
    agreed: claudeAnswer === question.correctOption,
    needsReview: claudeAnswer !== question.correctOption,
  };
}

// Prisma: ExamQuestion { qaStatus: 'AUTO_APPROVED' | 'NEEDS_REVIEW' | 'ADMIN_APPROVED' }
// Tylko ADMIN_APPROVED trafia do puli egzaminacyjnej użytkowników
```

**Panel admina** — nowa zakładka `/admin/pytania`:
- Lista wszystkich pytań z QA statusem
- Filtr: "Do weryfikacji" (NEEDS_REVIEW)
- Widok: pytanie + opcje + wynik Deepseek + wynik Claude + badge "NIEZGODNOŚĆ"
- Akcje: Zatwierdź A/B/C/D / Edytuj / Odrzuć

---

### 17b. Harmonogram Bloga — 4 Posty/Tydzień, 2 Persony

**Problem**: Plan mówi "2 artykuły/tydzień" ale nie określa: kiedy, która persona, jaki temat.

**Harmonogram (Vercel Cron Jobs — 4 niezależne crony):**

```
Poniedziałek 07:00 UTC → Persona 1 (Specjalistka AI) — temat z puli AI/ML
Środa       07:00 UTC → Persona 1 (Specjalistka AI) — temat z puli AI/ML
Wtorek      07:00 UTC → Persona 2 (Analityk Danych) — temat z puli Analytics
Czwartek    07:00 UTC → Persona 2 (Analityk Danych) — temat z puli Analytics
Niedziela   02:00 UTC → istniejący pipeline (kurs + egzaminy + analiza rynku pracy)
```

**Vercel `vercel.json` crons (4 wpisy):**
```json
{
  "crons": [
    { "path": "/api/cron/blog?persona=1", "schedule": "0 7 * * 1" },
    { "path": "/api/cron/blog?persona=1", "schedule": "0 7 * * 3" },
    { "path": "/api/cron/blog?persona=2", "schedule": "0 7 * * 2" },
    { "path": "/api/cron/blog?persona=2", "schedule": "0 7 * * 4" },
    { "path": "/api/cron/content-update", "schedule": "0 2 * * 0" }
  ]
}
```

**Zarządzanie pulą tematów** (aby nie powtarzać):
```typescript
// Prisma: BlogTopicQueue {
//   id, persona: 1|2, topic: String, status: 'QUEUED'|'PUBLISHED'|'SKIPPED'
//   priority: Int  // admin może podbić priorytet trending tematów
// }
// Cron pobiera zawsze topic z najwyższym priority i status=QUEUED
// Po publikacji: status=PUBLISHED
// Admin może dodawać tematy z panelu /admin/blog/tematy
```

**Automatyczne uzupełnianie puli tematów:**
- Jeśli pula < 8 tematów → Sunday cron generuje 20 nowych propozycji tematów
  - Persona 1: na podstawie arXiv (nowe publikacje AI) + trending GitHub AI repos
  - Persona 2: na podstawie job market snapshot + trending BI/Analytics narzędzi
- Admin zatwierdza / odrzuca propozycje tematów (NIE treść — tylko tematy)

**Antyduplikacja:**
```typescript
// Przed wygenerowaniem artykułu: sprawdź semantyczne podobieństwo do ostatnich 20 artykułów
// Używa Qwen3 8B embeddings → cosine similarity > 0.85 → pomiń temat
```

---

### 17c. Analiza UI/UX — Zidentyfikowane Błędy i Poprawki

| # | Problem | Wpływ | Fix |
|---|---|---|---|
| **UX-1** | **Content gate pojawia się w środku lekcji** — przycięcie zdania w połowie | Frustracja użytkownika, porzucenie | Gate ZAWSZE na końcu lekcji 2 (po ostatnim paragrafie), nigdy mid-content |
| **UX-2** | **Magic link → inny device** (sign-up na mobile, link otwiera się na desktop) | User utknął na mobile czekając na zalogowanie | Po kliknięciu magic linku: if (deviceType !== originDevice) → pokaż "Zalogowano na innym urządzeniu — wróć do poprzedniej zakładki lub [zaloguj tutaj]" |
| **UX-3** | **Egzamin — przypadkowe "Zakończ"** na mobile | Nieodwracalna utrata szansy egzaminacyjnej | Przycisk "Zakończ egzamin" wymaga dwukrokowego potwierdzenia: klik → modal "Czy na pewno? Odpowiedziałeś na X/60 pytań." → "Tak, zakończ" |
| **UX-4** | **Submit button ukryty przez klawiaturę mobilną** w egzaminie | User nie może wysłać odpowiedzi | `position: sticky; bottom: env(safe-area-inset-bottom, 16px)` — przycisk nad klawiaturą; opcja skrolowania pytań przy zamkniętej klawiaturze |
| **UX-5** | **Pusty dashboard** dla nowego użytkownika — tabele bez danych wyglądają jak błąd | Dezorientacja, utrata konwersji | Empty state z CTA: "Nie masz jeszcze żadnego kursu. [Zacznij naukę →]" + ilustracja brandowa |
| **UX-6** | **Brak "Wróć do lekcji"** po zalogowaniu przez magic link | User ląduje na /panel zamiast lekcji | Magic link zawiera `?redirect=/kursy/[slug]/[lesson]` — po logowaniu auto-redirect do lekcji gdzie skończyłeś |
| **UX-7** | **Error states nieokreślone**: magic link wygasł / płatność nieudana / egzamin już złożony | User widzi pustą stronę lub 500 | Dedykowane strony błędu dla każdego przypadku z jasnym komunikatem i CTA ("Wyślij nowy link", "Spróbuj ponownie", "Wróć do kursu") |
| **UX-8** | **Bottom navigation bar** — brak specyfikacji 4 zakładek | Implementacja ad-hoc, niespójność | Zakładki: Kursy / Postęp (%) / Certyfikaty / Profil. Aktywna: wypełniona ikona + kolor brand |
| **UX-9** | **Accessibility**: etykiety formularzy mogą nie być połączone z polami | WCAG 2.1 naruszenie | Każdy `<input>` ma `id` + `<label htmlFor={id}>` — nigdy `placeholder` jako jedyna etykieta |
| **UX-10** | **"Zapisz i kontynuuj" na egzaminie** — brak autosave | Utrata odpowiedzi przy rozładowaniu baterii/sieci | Autosave każdej odpowiedzi natychmiast po kliknięciu (`PATCH /api/exam/answer` per pytanie), nie tylko przy submit |

**Priorytet krytyczny**: UX-3 (egzamin) i UX-6 (magic link redirect) — bez tych dwóch konwersja do certyfikatu drastycznie spada.

---

### 17d. Analiza SEO — Zidentyfikowane Luki

| # | Problem | Fix |
|---|---|---|
| **SEO-1** | **Brak kategorii blogowych** `/blog/kategoria/ai/`, `/blog/kategoria/analityka/` — klastry bez hub stron | Dodaj route `/blog/[kategoria]/` z dedykowanymi meta + paginacją + breadcrumbs |
| **SEO-2** | **Brak internal linking matrix** — blog spokes nie linkują do kursów (główny cel konwersji) | Każdy artykuł blogowy musi mieć sekcję "Chcesz nauczyć się więcej? → [Kurs Analityki Danych]" — implementacja: `relatedCourse` pole w frontmatter MDX |
| **SEO-3** | **OG image musi być dokładnie 1200×630px** — nie "mniej więcej" | Zdefiniuj template w `public/og-template.png` (1200×630) + generator per page: `app/og/route.tsx` (Vercel og:image generation) |
| **SEO-4** | **Brak `<link rel="prev">/<link rel="next">`** dla paginacji bloga (strona 2, 3...) | Dodaj `alternates.prev/next` w `generateMetadata` stron paginacji |
| **SEO-5** | **News Sitemap** — Google Discover indeksuje świeże treści TYLKO z news sitemap | Dodaj `/sitemap-news.xml` generowany dynamicznie przez `next-sitemap` dla postów z ostatnich 48h |
| **SEO-6** | **Brak 301 redirect strategy** — jeśli URL lekcji zmieni się przy redesignie treści | `next.config.js redirects()` + dokument w repo: `redirects.json` jako źródło prawdy |
| **SEO-7** | **`rel="nofollow"` na zewnętrznych linkach** w artykułach blogowych — brak specyfikacji | MDX plugin auto-dodający `rel="noopener noreferrer"` (bezpieczeństwo) ale NIE `nofollow` dla cytowanych źródeł merytorycznych (zachowaj link juice flow) |
| **SEO-8** | **Alt text standard** nieokreślony — "po polsku" to za mało | Format: "[co widać na obrazku] — [kontekst lekcji/artykułu]". Nigdy: "zdjęcie", "obrazek", "grafika". Przykład: "Wykres słupkowy sprzedaży miesięcznej w Power BI — lekcja o wizualizacji danych" |
| **SEO-9** | **Orphan pages** — strony certyfikatów `/certyfikat/[uuid]` nie są linkowane z żadnej widocznej strony | Publiczne certyfikaty: meta robots `noindex` (nie chcemy indeksowania prywatnych osiągnięć) + `nofollow` w linku z dashboardu |
| **SEO-10** | **Core Web Vitals budżet na stronę** nieokreślony | Landing: LCP < 2.0s, CLS < 0.05. Lekcja: LCP < 2.5s. Egzamin: LCP < 1.5s (nic nie ładuje). Pomiar: Vercel Speed Insights w CI |

---

### 17e. Analiza Wydajności — Zidentyfikowane Problemy

| # | Problem | Fix |
|---|---|---|
| **PERF-1** | **N+1 query na dashboardzie** — `findMany(userProgress)` + loop `findFirst(exam)` per kurs | Jeden query z Prisma `select` + zagnieżdżone pola: `{ courses: { select: { progress: true, examAttempts: true } } }` |
| **PERF-2** | **PDF generowanie blokuje HTTP response** — @react-pdf/renderer: 2–5s | Async: `POST /api/certificates/generate` → zwróć `{ status: 'generating', jobId }` → klient polluje `GET /api/certificates/status/[jobId]` → `{ status: 'ready', url }` |
| **PERF-3** | **MDX kompilacja** nieokreślona — build-time vs runtime | Decyzja: Contentlayer kompiluje przy `npm run build` (build-time). Zmiana treści kursu → redeploy przez `git push`. Blog posts: ISR `revalidate: 3600` — zmiana bloga nie wymaga redeployu |
| **PERF-4** | **Egzamin: nie ładuj 150 pytań** do klienta | Server losuje 60 pytań na starcie egzaminu → zapisuje `assignedQuestionIds` w `ExamAttempt` → wysyła tylko te 60. Klient nigdy nie widzi pełnej bazy |
| **PERF-5** | **Redis key namespace collisions** — wiele features używa Redis bez prefiksów | Konwencja kluczy: `rate:`, `lock:`, `cache:`, `session:`, `admin:`, `exam:` — dokumentacja w `lib/redis/keys.ts` |
| **PERF-6** | **Brak image pipeline** — WebP konwersja ręczna lub pomijana | CI/CD: `npm run optimize-images` (sharp) w GitHub Actions przed commitem. Wszystkie obrazy w `/public/images/` muszą być WebP. Lint check w CI: blokuje PNG/JPG bez WebP odpowiednika |
| **PERF-7** | **Blog generation: 4 posty/tydzień mogą się nakładać** — 4 crony mogą startować jednocześnie jeśli serwer wolny | Redis distributed lock per persona: `lock:blog:persona-1` i `lock:blog:persona-2` — jedna instancja na raz |
| **PERF-8** | **Supabase free tier: 500 MB limit** — przy 150 pytaniach × 2 kursy × pełen tekst + blog → risk | Monitoring: Supabase Dashboard → Database size alert przy 400 MB. Blog images → Vercel Blob Storage (CDN), NIE w Supabase |

---

### 17f. Analiza Prawna (Polska) — Zidentyfikowane Luki

| # | Wymaganie | Problem | Fix |
|---|---|---|---|
| **PRAWA-1** | **Faktura VAT obowiązkowa** (Ordynacja podatkowa art. 106b) | Plan milczy o fakturowaniu | Każda transakcja 249/349 PLN → automatyczne wygenerowanie faktury. Opcje: Przelewy24 wbudowane fakturowanie ALBO InFakt API (prostsze). Faktura wysyłana emailem w ciągu 15 dni od transakcji |
| **PRAWA-2** | **Prawo do odstąpienia** (Ustawa o prawach konsumenta art. 38 ust. 13) | Brak mechanizmu wyłączenia 14-dniowego prawa do zwrotu dla treści cyfrowych | Przed zakupem egzaminu: WYMAGANY checkbox (niezaznaczony domyślnie): `☐ "Rozumiem, że egzamin (treść cyfrowa) staje się dostępny natychmiast i wyrażam zgodę na rozpoczęcie wykonania umowy, przez co tracę prawo do odstąpienia od umowy (art. 38 ust. 13 UPK)."` Brak zaznaczenia = blokada płatności |
| **PRAWA-3** | **Dane firmy na stronie** (Ustawa o USDE art. 5) | Plan nie przewiduje stopki z danymi przedsiębiorcy | Stopka każdej strony + strona `/kontakt`: NIP, REGON, nazwa firmy, adres siedziby, email kontaktowy, telefon (lub brak telefonu = "tylko email") |
| **PRAWA-4** | **Procedura reklamacji** (UPK art. 43b i nast.) | Brak strony `/reklamacje` | Strona `/reklamacje` z: formularzem reklamacyjnym, terminem rozpatrzenia (14 dni — obowiązek ustawowy), adresem do korespondencji. Brevo: automatyczne potwierdzenie otrzymania reklamacji |
| **PRAWA-5** | **RODO art. 20 — przenoszenie danych** | Plan ma eksport JSON ale bez terminu | Dodaj do polityki prywatności i UX: "Odpowiadamy na żądania przeniesienia danych w ciągu **30 dni** (art. 12 RODO). Format: JSON." |
| **PRAWA-6** | **European Accessibility Act (EAA) — czerwiec 2025** | Dotyczy prywatnych serwisów cyfrowych od 28.06.2025 | WCAG 2.1 AA jest teraz wymogiem prawnym, nie tylko best-practice. Obowiązkowe: deklaracja dostępności `/deklaracja-dostepnosci` + alternatywne sposoby kontaktu dla osób z niepełnosprawnościami |
| **PRAWA-7** | **UOKiK 2023: "uzasadniony interes" zablokowany dla reklamy** | Plan używa Brevo tracking pixel → może wymagać zgody nawet w kategorii "funkcjonalne" | Reklasyfikacja cookies Brevo: pixel śledzący kliknięcia w emailach = MARKETING (zgoda), nie "funkcjonalne". Zmiana w cookie banner i polityce |
| **PRAWA-8** | **Wiek 16 lat + egzamin 18 lat: weryfikacja wyłącznie checkbox** | Checkbox "Mam 18 lat" nie jest dowodem w sporze konsumenckim | Dodaj do regulaminu: "Zaznaczając checkbox potwierdzasz wiek pod rygorem odpowiedzialności prawnej." + przy rejestracji rok urodzenia (opcjonalnie — do weryfikacji w razie sporu) |

---

### 17g. Analiza Cyberbezpieczeństwa — Nowe Bugi (#10–#12)

### Security Bug #10: Content Injection przez AI-Generated MDX

**Bug**: AI generuje treści kursów i artykuły blogowe zapisywane jako pliki MDX. Jeśli Deepseek/Qwen wygeneruje `<script>alert(1)</script>` lub niebezpieczny JSX komponent (np. `<iframe src="...">`) — Next.js MDX rendering to wykona w przeglądarce użytkownika → XSS.

**Scenariusz**: Prompt injection w zewnętrznych danych (arXiv scraping w etapie 1 weekly pipeline) → atakujący umieszcza w opisie artykułu naukowego `</p><script>document.cookie...</script>` → pipeline przepisuje to do MDX → deploy → XSS dla wszystkich odwiedzających.

**Fix**: Sanityzacja przed zapisem do pliku MDX:
```typescript
// lib/cron/sanitizeMDX.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeAIContent(content: string): string {
  // Usuń wszystkie HTML tagi z AI-generated content
  const sanitized = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [],  // zero HTML tagów — tylko czysty tekst + Markdown
    ALLOWED_ATTR: [],
  });
  // Zablokuj niebezpieczne wzorce Markdown które mogą być JSX
  return sanitized
    .replace(/<[A-Z][^>]*>/g, '')      // blokuje JSX komponenty
    .replace(/import\s+/g, '')          // blokuje import statements
    .replace(/export\s+/g, '');         // blokuje export statements
}
```
Sanityzacja wymagana PRZED zapisem do `content/courses/*.mdx` i `content/blog/*.mdx`.

---

### Security Bug #11: Exam Answer Tampering (Podmiana Odpowiedzi Przed Wysłaniem)

**Bug**: `POST /api/exam/submit` przyjmuje `{ attemptId, answers: [{questionId: "q1", selected: "B"}, ...] }`. Klient może modyfikować `questionId` lub `selected` wartości w DevTools przed wysłaniem. W najgorszym wypadku — można wysłać odpowiedzi do pytań, które NIE były przypisane do danego egzaminu.

**Scenariusz**: Atakujący otwiera network tab, nagrywa prawidłowy request submit, edytuje `selected: "A"` → `selected: "C"` (poprawna odpowiedź) dla każdego pytania → 100% wynik → certyfikat za darmo.

**Fix**: Server autorytarna walidacja przypisanych pytań:
```typescript
// app/api/exam/submit/route.ts
const attempt = await prisma.examAttempt.findUnique({
  where: { id: body.attemptId },
  select: { assignedQuestionIds: true, userId: true, submittedAt: true }
});

// 1. Sprawdź właściciela
if (attempt.userId !== session.user.id) return 403;

// 2. Sprawdź czy nie złożono już wcześniej
if (attempt.submittedAt) return new Response('Already submitted', { status: 409 });

// 3. Weryfikuj że przesłane questionId należą do PRZYPISANYCH pytań tego egzaminu
const allowedIds = new Set(attempt.assignedQuestionIds);
const tampered = body.answers.some(a => !allowedIds.has(a.questionId));
if (tampered) {
  await prisma.securityLog.create({ data: { type: 'EXAM_TAMPERING', userId: session.user.id } });
  return new Response('Invalid questions', { status: 400 });
}

// 4. Oblicz wynik SERVER-SIDE na podstawie poprawnych odpowiedzi z DB
// (nigdy nie ufaj wyniku przesłanemu przez klienta)
const correctAnswers = await prisma.examQuestion.findMany({
  where: { id: { in: attempt.assignedQuestionIds } },
  select: { id: true, correctOption: true }
});
const score = correctAnswers.filter(q =>
  body.answers.find(a => a.questionId === q.id && a.selected === q.correctOption)
).length;
```

---

### Security Bug #12: PDF Metadata / Injection przez Imię Użytkownika

**Bug**: Imię i nazwisko użytkownika (user-provided) jest bezpośrednio renderowane w certyfikacie PDF przez `@react-pdf/renderer`. Specjalne znaki lub bardzo długie ciągi mogą:
- Przepełnić layout PDF (brak truncation)
- Potencjalnie wstrzyknąć metadane jeśli renderer nie sanityzuje

**Scenariusz**: User podaje imię: `Aaaaaaa[...]aaaa` (1000 znaków) → PDF overflow / crash renderera → 500 error.

**Fix**:
```typescript
// lib/validation/userSchema.ts
export const nameSchema = z.string()
  .min(2, 'Imię musi mieć co najmniej 2 znaki')
  .max(100, 'Imię może mieć maksymalnie 100 znaków')
  .regex(/^[\p{L}\s\-'\.]+$/u, 'Imię może zawierać tylko litery, spacje i myślniki')
  .transform(name => name.trim());

// components/certificate/CertificatePDF.tsx
// Truncate z wielokropkiem jako dodatkowe zabezpieczenie renderera:
const displayName = name.length > 80 ? name.slice(0, 77) + '...' : name;
```

---

## 18. PageSpeed Quality Gate — 99% Mobile

### Target

**Performance = 99%** na https://pagespeed.web.dev/ w widoku **Mobile**.
Nie deployujemy na produkcję dopóki score < 99%. Każda zmiana wizualna wymaga ponownego sprawdzenia.

### Kiedy sprawdzać

| Moment | Jak |
|---|---|
| Lokalne dev (przed push) | `npm run pagespeed` — Lighthouse CLI przeciwko localhost:3000 |
| Vercel Preview (staging) | Ręcznie: wklej Preview URL do pagespeed.web.dev → Mobile |
| Przed mergem do main | GitHub Actions: `lhci autorun` blokuje merge jeśli < 99% |
| Po deploymencie produkcji | Obowiązkowe: pagespeed.web.dev → neurova.pl → Mobile = 99% |
| Cotygodniowy monitoring | Vercel Cron (pon. 06:00 UTC) → `/api/cron/pagespeed-check` → alert jeśli < 95% |

> **Staging = Vercel Preview Deployments.** Każdy push/PR dostaje unikalny URL (np. `neurova-git-feature-xyz.vercel.app`). Sprawdzaj ten URL przed mergem — Vercel Preview zachowuje się jak produkcja (Edge Network, kompresja, CDN).

### Automatyzacja — Lighthouse CI (GitHub Actions)

```yaml
# .github/workflows/lighthouse-ci.yml
# Uruchamiane przy każdym push do PR. Blokuje merge jeśli score < 99%
- name: Run Lighthouse CI
  run: lhci autorun
  env:
    LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

```json
// .lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000"],
      "settings": { "formFactor": "mobile", "screenEmulation": { "mobile": true } }
    },
    "assert": {
      "preset": "lighthouse:no-pwa",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.99 }],
        "categories:seo": ["error", { "minScore": 0.99 }],
        "categories:accessibility": ["warn", { "minScore": 0.95 }]
      }
    }
  }
}
```

### Iteracja — Kolejność optymalizacji wg wpływu (mobile-first)

Gdy wynik < 99%, otwórz PageSpeed Insights i sprawdź **które metryki nie przechodzą**:

| Metryka | Typowa przyczyna | Fix |
|---|---|---|
| **LCP** (Largest Contentful Paint) | Hero image bez `priority` | `<Image priority />` na pierwszym obrazie above-the-fold |
| **LCP** | Zewnętrzny CSS blokujący render | Sprawdź czy nie ma `<link rel="stylesheet">` poza `next/font` |
| **LCP** | Wolny TTFB | Użyj SSG / ISR zamiast SSR na stronach statycznych |
| **CLS** (Cumulative Layout Shift) | Obrazy bez `width`/`height` | Zawsze podaj wymiary w `<Image>` |
| **CLS** | Web font shift (FOUT) | `next/font/google` z `display: 'swap'` — domyślnie OK |
| **CLS** | Dynamiczne bannery (cookie, toast) | `position: fixed` zamiast `relative`; zarezerwuj miejsce |
| **INP** (Interaction to Next Paint) | Ciężkie bundle JS | Dynamic imports: `const Comp = dynamic(() => import('./Heavy'))` |
| **INP** | Blocking hydration | Preferuj Server Components, minimalizuj Client Components |
| **FCP** (First Contentful Paint) | Nieużywany CSS w bundle | Tailwind purge (domyślnie OK); sprawdź `@import` w globals.css |
| **FCP** | Zbyt duże inline CSS | Przenieś krytyczny CSS do stylów zewnętrznych z preload |
| **TBT** (Total Blocking Time) | Duże third-party scripts | Załaduj Umami, Brevo pixel jako `strategy="lazyOnload"` (next/script) |

### Proces iteracji (loop)

```
1. Deploy na Vercel Preview
2. Wklej Preview URL na https://pagespeed.web.dev/ → tryb Mobile → Analyze
3. Jeśli score = 99% → merge dozwolony ✅
4. Jeśli score < 99%:
   a. Sprawdź "Opportunities" i "Diagnostics" w raporcie
   b. Zidentyfikuj metrykę z najniższym wynikiem (LCP / CLS / INP / TBT)
   c. Zastosuj fix z tabeli powyżej
   d. Commitujesz → Vercel Preview auto-aktualizuje URL
   e. Wróć do kroku 2
5. Repeat aż score = 99%
```

### Lokalny skrypt (bez deploy)

```bash
# Uruchom dev server
npm run dev

# W drugim terminalu: sprawdź PageSpeed lokalnie (odpowiednik Lighthouse)
npm run pagespeed
# Otwiera raport HTML z wynikiem mobile i listą problemów

# Lub wskaż konkretny URL:
npm run pagespeed -- --url=http://localhost:3000/kursy/analityka-danych
```

### Cotygodniowy monitoring produkcji

```typescript
// app/api/cron/pagespeed-check/route.ts
// Sprawdza score co tydzień — alert jeśli regresja (blog auto-publish może obniżyć wynik)
// Używa bezpłatnego PageSpeed Insights API (Google)
// Alert: email do admina przez Brevo + wpis w SecurityLog

export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  const url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://neurova.pl&strategy=mobile&key=${process.env.GOOGLE_PSI_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  const score = data.lighthouseResult.categories.performance.score * 100;
  if (score < 95) {
    // Wyślij alert do admina przez Brevo
    await notifyAdminPerformanceRegression(score);
  }
  return Response.json({ score, timestamp: new Date().toISOString() });
}
```

```json
// vercel.json — dodać do istniejących cronów:
{ "path": "/api/cron/pagespeed-check", "schedule": "0 6 * * 1" }
```

### Zmienne środowiskowe

```env
# .env.local / .env.production
GOOGLE_PSI_API_KEY=AIza...  # Bezpłatny klucz z Google Cloud Console (PageSpeed Insights API)
                             # Bez klucza: 25 req/100s limit (wystarcza do testów)
```

### Core Web Vitals budżet per typ strony

| Strona | LCP | CLS | INP | PageSpeed Mobile |
|---|---|---|---|---|
| Landing page | < 1.8s | < 0.05 | < 150ms | **99%** |
| Strona kursu | < 2.0s | < 0.05 | < 200ms | **99%** |
| Lekcja (MDX) | < 2.5s | < 0.1 | < 200ms | **99%** |
| Egzamin | < 1.5s | < 0.05 | < 100ms | **99%** |
| Blog artykuł | < 2.0s | < 0.1 | < 200ms | **99%** |
