import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Polityka cookies — Neurova AI Academy',
  description: 'Informacje o plikach cookie używanych przez Neurova AI Academy',
};

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-heading font-bold text-3xl text-brand-navy mb-2">Polityka cookies</h1>
      <p className="text-brand-muted mb-10">Ostatnia aktualizacja: 1 lipca 2025</p>

      <div className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:text-brand-navy">
        <h2>1. Czym są pliki cookie?</h2>
        <p>Pliki cookie to małe pliki tekstowe zapisywane na Twoim urządzeniu przez przeglądarkę. Dzięki nim strona może zapamiętać Twoją sesję i preferencje.</p>

        <h2>2. Jakich cookies używamy?</h2>

        <h3>Niezbędne (zawsze aktywne)</h3>
        <table>
          <thead><tr><th>Nazwa</th><th>Cel</th><th>Wygasanie</th></tr></thead>
          <tbody>
            <tr><td>next-auth.session-token</td><td>Sesja logowania</td><td>30 dni</td></tr>
            <tr><td>next-auth.csrf-token</td><td>Ochrona CSRF</td><td>Sesja</td></tr>
          </tbody>
        </table>
        <p>Tych plików nie można wyłączyć — są konieczne do działania konta i logowania.</p>

        <h3>Funkcjonalne (opcjonalne)</h3>
        <table>
          <thead><tr><th>Nazwa</th><th>Cel</th><th>Wygasanie</th></tr></thead>
          <tbody>
            <tr><td>neurova-cookie-consent</td><td>Zapamiętanie Twojego wyboru cookie</td><td>1 rok</td></tr>
          </tbody>
        </table>

        <h3>Analityczne (opcjonalne)</h3>
        <p>Używamy <strong>Umami Analytics</strong> — samohostowanego narzędzia bez fingerprinting, bez cross-site tracking, bez zewnętrznych żądań. Dane są anonimowe i nie opuszczają naszych serwerów. Umami nie ustawia pliku cookie — używa localStorage.</p>

        <h2>3. Jak zarządzać cookies?</h2>
        <p>Możesz zmienić swoje preferencje w dowolnym momencie, klikając „Zarządzaj cookies" w stopce strony lub czynicząc ustawienia bezpośrednio w przeglądarce:</p>
        <ul>
          <li>Chrome: Ustawienia → Prywatność i bezpieczeństwo → Pliki cookie</li>
          <li>Firefox: Ustawienia → Prywatność i bezpieczeństwo</li>
          <li>Safari: Ustawienia → Safari → Prywatność</li>
        </ul>

        <h2>4. Brak cookies reklamowych</h2>
        <p>Nie używamy plików cookie reklamowych, śledzących ani cookies podmiotów trzecich (Meta Pixel, Google Ads itp.).</p>
      </div>
    </div>
  );
}
