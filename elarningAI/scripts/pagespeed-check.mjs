#!/usr/bin/env node
/**
 * Lokalny sprawdzacz PageSpeed — odpowiednik pagespeed.web.dev dla localhost.
 * Uruchom: npm run pagespeed
 * Lub z niestandardowym URL: npm run pagespeed -- --url=http://localhost:3000/kursy
 *
 * Wynik 99% = gotowe do deployu. Poniżej 99% = sprawdź sekcję 18 PLAN.md.
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const args = process.argv.slice(2);
const urlArg = args.find((a) => a.startsWith('--url='));
const TARGET_URL = urlArg ? urlArg.split('=')[1] : 'http://localhost:3000';
const REPORT_DIR = join(ROOT, '.lighthouse-reports');

if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });

const REPORT_PATH = join(REPORT_DIR, 'report.html');

console.log(`\n🔍 Sprawdzam PageSpeed dla: ${TARGET_URL}`);
console.log('   Emulacja: Mobile (Moto G4, throttled 4G)\n');

try {
  execSync(
    [
      'npx lighthouse',
      TARGET_URL,
      '--output=html',
      `--output-path="${REPORT_PATH}"`,
      '--form-factor=mobile',
      '--throttling-method=simulate',
      '--throttling.rttMs=150',
      '--throttling.throughputKbps=1638.4',
      '--throttling.cpuSlowdownMultiplier=4',
      '--screenEmulation.mobile',
      '--screenEmulation.width=375',
      '--screenEmulation.height=812',
      '--screenEmulation.deviceScaleFactor=2',
      '--only-categories=performance,seo,accessibility,best-practices',
      '--chrome-flags="--headless --no-sandbox --disable-gpu"',
    ].join(' '),
    { stdio: 'inherit', cwd: ROOT }
  );

  console.log(`\n✅ Raport zapisany: ${REPORT_PATH}`);
  console.log('   Otwórz go w przeglądarce żeby zobaczyć szczegóły.\n');
  console.log('📋 Cel: Performance = 99% (mobile)');
  console.log('   Jeśli score < 99% — sprawdź sekcję 18 PLAN.md po listę fixów.\n');

  // Otwórz raport w domyślnej przeglądarce
  const open = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  execSync(`${open} "${REPORT_PATH}"`, { stdio: 'ignore' });
} catch (err) {
  console.error('\n❌ Błąd podczas uruchamiania Lighthouse.');
  console.error('   Upewnij się że:');
  console.error('   1. Aplikacja działa: npm run dev');
  console.error(`   2. URL jest dostępny: ${TARGET_URL}`);
  console.error('   3. Chrome/Chromium jest zainstalowany\n');
  process.exit(1);
}
