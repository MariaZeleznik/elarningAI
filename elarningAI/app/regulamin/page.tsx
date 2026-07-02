import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Regulamin — Neurova AI Academy',
  description: 'Regulamin korzystania z platformy edukacyjnej Neurova AI Academy',
};

export default function RegulaminPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-heading font-bold text-3xl text-brand-navy mb-2">Regulamin</h1>
      <p className="text-brand-muted mb-10">Wersja 1.0 · Obowiązuje od 1 lipca 2025</p>

      <div className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:text-brand-navy">
        <h2>§1. Postanowienia ogólne</h2>
        <p>Niniejszy regulamin określa zasady korzystania z platformy edukacyjnej Neurova AI Academy (dalej: „Platforma"), dostępnej pod adresem neurova.pl.</p>

        <h2>§2. Rejestracja i konto</h2>
        <ol>
          <li>Rejestracja wymaga podania adresu e-mail, imienia i wyrażenia zgody na regulamin.</li>
          <li>Użytkownik musi mieć ukończone 16 lat. Do zakupu egzaminu wymagane jest ukończenie 18 lat.</li>
          <li>Logowanie odbywa się przez jednorazowy link e-mail (magic link) — bez hasła.</li>
        </ol>

        <h2>§3. Dostęp do treści</h2>
        <ol>
          <li>Pierwsze 2 lekcje każdego kursu są bezpłatne i dostępne bez rejestracji.</li>
          <li>Lekcja 3 i kolejne wymagają założenia konta (bezpłatne).</li>
          <li>Dostęp do egzaminu certyfikacyjnego wymaga jednorazowej opłaty.</li>
        </ol>

        <h2>§4. Egzaminy i certyfikaty</h2>
        <ol>
          <li>Egzamin składa się z 60 pytań jednokrotnego wyboru, losowanych z banku pytań.</li>
          <li>Czas egzaminu: 90 minut.</li>
          <li>Do zdania wymagane jest udzielenie 70% prawidłowych odpowiedzi (42/60 pytań).</li>
          <li>Certyfikat jest wystawiany automatycznie po zdaniu egzaminu.</li>
          <li>Certyfikat jest publiczny i możliwy do weryfikacji pod unikalnym adresem URL.</li>
          <li>Opłata za egzamin dotyczy jednej próby. Ponowne podejście wymaga ponownej opłaty.</li>
        </ol>

        <h2>§5. Płatności i zwroty</h2>
        <ol>
          <li>Płatności obsługuje Przelewy24 (Blue Media S.A.).</li>
          <li>Egzamin jest treścią cyfrową dostępną natychmiast po opłacie.</li>
          <li>Zgodnie z art. 38 ust. 13 Ustawy o prawach konsumenta: <strong>prawo do odstąpienia nie przysługuje</strong>, jeśli wykonanie usługi rozpoczęto za wyraźną zgodą konsumenta przed upływem 14-dniowego terminu.</li>
          <li>Reklamacje: hello@neurova.pl (odpowiedź w ciągu 14 dni roboczych).</li>
        </ol>

        <h2>§6. Prawa autorskie</h2>
        <p>Wszelkie treści na Platformie (lekcje, pytania egzaminacyjne, materiały) są własnością Neurova AI Academy i podlegają ochronie prawnoautorskiej. Kopiowanie i redystrybucja bez zgody są zabronione.</p>

        <h2>§7. Odpowiedzialność</h2>
        <p>Platforma dostarcza treści edukacyjne "as is". Nie gwarantujemy rezultatów zawodowych po ukończeniu kursu. Certyfikat potwierdza wiedzę zdobytą na Platformie, nie jest akredytowanym dokumentem państwowym.</p>

        <h2>§8. Postanowienia końcowe</h2>
        <p>Regulamin podlega prawu polskiemu. Sądem właściwym jest sąd właściwy dla siedziby Neurova AI Academy.</p>
      </div>
    </div>
  );
}
