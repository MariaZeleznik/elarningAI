/**
 * Cotygodniowy cron sprawdzający PageSpeed (pon. 06:00 UTC — vercel.json).
 * Używa bezpłatnego PageSpeed Insights API Google.
 * Jeśli score < 95% → email alertowy do admina (blog auto-publish mógł spowodować regresję).
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://neurova.pl';
const PSI_API_KEY = process.env.GOOGLE_PSI_API_KEY ?? '';
const ALERT_THRESHOLD = 95;

export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const psiUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  psiUrl.searchParams.set('url', SITE_URL);
  psiUrl.searchParams.set('strategy', 'mobile');
  if (PSI_API_KEY) psiUrl.searchParams.set('key', PSI_API_KEY);

  let score: number;
  let metrics: Record<string, unknown> = {};

  try {
    const res = await fetch(psiUrl.toString(), { next: { revalidate: 0 } });
    if (!res.ok) throw new Error(`PSI API error: ${res.status}`);
    const data = await res.json();
    score = Math.round((data.lighthouseResult?.categories?.performance?.score ?? 0) * 100);
    metrics = {
      lcp: data.lighthouseResult?.audits?.['largest-contentful-paint']?.displayValue,
      cls: data.lighthouseResult?.audits?.['cumulative-layout-shift']?.displayValue,
      inp: data.lighthouseResult?.audits?.['interaction-to-next-paint']?.displayValue,
      fcp: data.lighthouseResult?.audits?.['first-contentful-paint']?.displayValue,
    };
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }

  const result = {
    score,
    metrics,
    url: SITE_URL,
    strategy: 'mobile',
    timestamp: new Date().toISOString(),
    alertSent: false,
  };

  if (score < ALERT_THRESHOLD) {
    // TODO: wysłać email przez Brevo (sekcja 13a PLAN.md)
    console.warn(`[pagespeed-check] REGRESJA: score=${score}% < ${ALERT_THRESHOLD}%`, metrics);
    result.alertSent = true;
  }

  return Response.json(result);
}
