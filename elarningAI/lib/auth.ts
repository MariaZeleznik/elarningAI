import fs from 'fs';
import path from 'path';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import { config } from '@/config';

// Dev-only: persist magic link URLs to a file so they survive HMR module reloads
// and cross-context API route calls. NextAuth hashes the token before storing in DB;
// the plaintext URL is only available in sendVerificationRequest.
const DEV_LINKS_FILE = path.join(process.cwd(), '.next', 'dev-magic-links.json');

function writeDevMagicLink(email: string, url: string) {
  try {
    const dir = path.dirname(DEV_LINKS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const existing: Record<string, string> = fs.existsSync(DEV_LINKS_FILE)
      ? JSON.parse(fs.readFileSync(DEV_LINKS_FILE, 'utf-8'))
      : {};
    existing[email] = url;
    fs.writeFileSync(DEV_LINKS_FILE, JSON.stringify(existing));
  } catch { /* ignore file errors in dev */ }
}

export function getDevMagicLink(email: string): string | null {
  try {
    const data = JSON.parse(fs.readFileSync(DEV_LINKS_FILE, 'utf-8')) as Record<string, string>;
    return data[email] ?? null;
  } catch { return null; }
}

const devCredentialsProvider = config.email.provider === 'console'
  ? [CredentialsProvider({
      id: 'dev-credentials',
      name: 'Dev Login',
      credentials: { email: { label: 'Email', type: 'email' } },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    })]
  : [];

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
  providers: [
    ...devCredentialsProvider,
    EmailProvider({
      server: config.email.provider === 'console'
        ? { host: 'localhost', port: 25, auth: { user: '', pass: '' } }
        : {
            host: 'smtp-relay.brevo.com',
            port: 587,
            auth: {
              user: 'neurova@brevo',
              pass: config.email.brevoApiKey ?? '',
            },
          },
      from: `${config.email.fromName} <${config.email.fromAddress}>`,
      // W trybie dev logujemy link do konsoli zamiast wysyłać email
      sendVerificationRequest:
        config.email.provider === 'console'
          ? async ({ identifier: email, url }) => {
              writeDevMagicLink(email, url);
              console.log('\n─────────────────────────────────────────');
              console.log('  📧 MAGIC LINK (tryb dev — brak emaila)');
              console.log(`  Email: ${email}`);
              console.log(`  Link:  ${url}`);
              console.log('─────────────────────────────────────────\n');
            }
          : undefined,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dni
  },
  pages: {
    signIn: '/logowanie',
    verifyRequest: '/logowanie?verify=1',
    error: '/logowanie?error=1',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? 'USER';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? 'USER';
      }
      return session;
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      if (isNewUser) {
        console.log(`[auth] Nowy użytkownik: ${user.email}`);
      }
    },
  },
};

// Rozszerzenie typów NextAuth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
  }
}
