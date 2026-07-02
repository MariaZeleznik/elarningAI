export const config = {
  site: {
    name: process.env.NEXT_PUBLIC_SITE_NAME ?? 'Neurova AI Academy',
    brand: process.env.NEXT_PUBLIC_BRAND ?? 'Neurova',
    domain: process.env.NEXT_PUBLIC_DOMAIN ?? 'neurova.pl',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://neurova.pl',
    supportEmail: process.env.SUPPORT_EMAIL ?? 'kontakt@neurova.pl',
  },
  analytics: {
    provider: (process.env.ANALYTICS_PROVIDER ?? 'none') as 'umami' | 'plausible' | 'none',
    umamiWebsiteId: process.env.UMAMI_WEBSITE_ID,
    umamiScriptUrl: process.env.UMAMI_SCRIPT_URL,
  },
  email: {
    provider: (process.env.EMAIL_PROVIDER ?? 'console') as 'brevo' | 'console',
    brevoApiKey: process.env.BREVO_API_KEY,
    fromName: process.env.EMAIL_FROM_NAME ?? 'Neurova AI Academy',
    fromAddress: process.env.EMAIL_FROM ?? 'noreply@neurova.pl',
  },
  payment: {
    provider: (process.env.PAYMENT_PROVIDER ?? 'przelewy24') as 'przelewy24',
    mode: (process.env.PAYMENT_MODE ?? 'mock') as 'mock' | 'sandbox' | 'live',
    p24MerchantId: process.env.P24_MERCHANT_ID,
    p24ApiKey: process.env.P24_API_KEY,
    p24CrcKey: process.env.P24_CRC_KEY,
    currency: 'PLN',
    examPrices: {
      'analityka-danych': Number(process.env.EXAM_PRICE_ANALYTICS) || 24900,
      'ai-machine-learning': Number(process.env.EXAM_PRICE_AI) || 34900,
    } as Record<string, number>,
  },
  ai: {
    localBaseUrl: process.env.AI_LOCAL_URL ?? 'http://192.168.0.180:1234',
    contentProvider: (process.env.AI_CONTENT_PROVIDER ?? 'local') as 'local' | 'deepseek-api' | 'claude',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    deepseekApiKey: process.env.DEEPSEEK_API_KEY,
  },
  admin: {
    allowedIPs: (process.env.ADMIN_ALLOWED_IPS ?? '')
      .split(',')
      .map((ip) => ip.trim())
      .filter(Boolean),
    cronSecret: process.env.CRON_SECRET ?? '',
  },
} as const;

export type PaymentMode = typeof config.payment.mode;
export type EmailProvider = typeof config.email.provider;
