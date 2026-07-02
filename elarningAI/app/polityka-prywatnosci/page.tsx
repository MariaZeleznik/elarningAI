import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Polityka prywatności — Neurova AI Academy',
  description: 'Informacje o przetwarzaniu danych osobowych zgodnie z RODO',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-heading font-bold text-3xl text-brand-navy mb-2">Polityka prywatności</h1>
      <p className="text-brand-muted mb-10">Ostatnia aktualizacja: 1 lipca 2025</p>

      <div className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:text-brand-navy">
        <h2>1. Administrator danych</h2>
        <p>Administratorem Twoich danych osobowych jest Neurova AI Academy, prowadząca działalność edukacyjną online. Kontakt: hello@neurova.pl</p>

        <h2>2. Jakie dane zbieramy</h2>
        <ul>
          <li><strong>Adres e-mail</strong> — wymagany do rejestracji i logowania (magic link)</li>
          <li><strong>Imię i nazwisko</strong> — opcjonalne, używane na certyfikatach</li>
          <li><strong>Postęp nauki</strong> — ukończone lekcje, wyniki egzaminów</li>
          <li><strong>Dane płatności</strong> — ID transakcji Przelewy24 (nie przechowujemy numerów kart)</li>
        </ul>

        <h2>3. Podstawy prawne przetwarzania (RODO art. 6)</h2>
        <ul>
          <li><strong>Art. 6 ust. 1 lit. b</strong> — wykonanie umowy (konto, zakup egzaminu)</li>
          <li><strong>Art. 6 ust. 1 lit. c</strong> — obowiązek prawny (faktury, księgowość)</li>
          <li><strong>Art. 6 ust. 1 lit. a</strong> — zgoda (newsletter/marketing — oddzielna checkbox)</li>
        </ul>

        <h2>4. Logowanie bez hasła (magic link)</h2>
        <p>Nie przechowujemy haseł. Logowanie odbywa się przez jednorazowy link wysyłany na adres e-mail, ważny 10 minut. Linki są szyfrowane i jednorazowe.</p>

        <h2>5. Pliki cookie</h2>
        <p>Używamy plików cookie wyłącznie do: sesji logowania (niezbędne) i opcjonalnie do analityki (Umami — bez fingerprinting, anonimowe). Szczegóły w <a href="/polityka-cookies">Polityce cookies</a>.</p>

        <h2>6. Twoje prawa</h2>
        <ul>
          <li>Prawo dostępu do danych (art. 15 RODO)</li>
          <li>Prawo do sprostowania (art. 16 RODO)</li>
          <li>Prawo do usunięcia ("prawo do bycia zapomnianym", art. 17 RODO)</li>
          <li>Prawo do przenoszenia danych (art. 20 RODO)</li>
          <li>Prawo do cofnięcia zgody na marketing w dowolnym momencie</li>
        </ul>
        <p>Aby skorzystać z praw, napisz na: hello@neurova.pl</p>

        <h2>7. Okres przechowywania</h2>
        <ul>
          <li>Dane konta: do usunięcia konta lub 3 lata braku aktywności</li>
          <li>Certyfikaty: bezterminowo (publiczne potwierdzenie ukończenia)</li>
          <li>Dane płatności: 5 lat (obowiązek podatkowy)</li>
        </ul>

        <h2>8. Bezpieczeństwo</h2>
        <p>Dane przechowywane w PostgreSQL na serwerach UE (Vercel, region Frankfurt). Połączenia szyfrowane TLS 1.3. Dostęp adminów ograniczony do allowlist IP.</p>

        <h2>9. Kontakt i skargi</h2>
        <p>Prawo do skargi do Prezesa UODO: <a href="https://uodo.gov.pl" rel="noopener">uodo.gov.pl</a></p>
      </div>
    </div>
  );
}
