import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutzerklärung — Schwarzes Gold Tyre" },
      { name: "description", content: "Datenschutzerklärung der Schwarzes Gold Reifenhandel UG gemäß DSGVO." },
    ],
  }),
  component: DatenschutzPage,
});

const sections = [
  {
    n: "01",
    title: "Verantwortlicher",
    body: (
      <p>
        Schwarzes Gold Reifenhandel UG (haftungsbeschränkt)<br />
        Geschäftsführer: Egor Nikolaenko<br />
        Muggensturmer Landstraße 4-6, 76467 Bietigheim<br />
        E-Mail: <a href="mailto:info@schwarzesgoldtyre.com" className="text-gold hover:underline">info@schwarzesgoldtyre.com</a><br />
        Telefon: <a href="tel:+4915567167624" className="text-gold hover:underline">+49 15567 167624</a>
      </p>
    ),
  },
  {
    n: "02",
    title: "Rechtsgrundlagen (Art. 6 DSGVO)",
    body: (
      <>
        <p>Die Verarbeitung personenbezogener Daten erfolgt auf Grundlage von:</p>
        <ul className="mt-3 space-y-2 list-none">
          <li className="pl-4 border-l border-gold/40">Art. 6(1)(f) DSGVO – Berechtigte Interessen (IT-Sicherheit, Missbrauchsabwehr, Website-Betrieb, Kontaktformular)</li>
          <li className="pl-4 border-l border-gold/40">Art. 6(1)(a) DSGVO – Einwilligung (sofern Sie uns diese ausdrücklich erteilen)</li>
          <li className="pl-4 border-l border-gold/40">Art. 6(1)(b) DSGVO – Vertragserfüllung (wenn Sie eine Anfrage stellen)</li>
        </ul>
      </>
    ),
  },
  {
    n: "03",
    title: "Ihre Rechte",
    body: (
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
        Datenübertragbarkeit und Widerspruch. Wenden Sie sich hierfür an{" "}
        <a href="mailto:info@schwarzesgoldtyre.com" className="text-gold hover:underline">info@schwarzesgoldtyre.com</a>.
      </p>
    ),
  },
  {
    n: "04",
    title: "Kontaktformular",
    body: (
      <p>
        Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular
        inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall
        von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
      </p>
    ),
  },
  {
    n: "05",
    title: "Hosting & Technische Dienstleister",
    body: (
      <>
        <p>
          Diese Website wird bei Cloudflare, Inc. (101 Townsend Street, San Francisco, CA 94107, USA)
          gehostet. Beim Aufruf werden technisch notwendige Server-Logdaten (z.B. IP-Adresse, Zeitpunkt
          des Zugriffs) verarbeitet. Die Verarbeitung erfolgt auf Grundlage von Art. 6(1)(f) DSGVO.
        </p>
        <p className="mt-3">
          Datenbankdienstleister: Supabase Inc., 970 Trestle Glen Rd, Oakland, CA 94610, USA.
          Ihre Anfragedaten (Name, Firma, Telefon etc.) werden dort gespeichert. Grundlage: Art. 6(1)(b) DSGVO.
        </p>
        <p className="mt-3">
          Weitere Infos:{" "}
          <a href="https://supabase.com/privacy" target="_blank" rel="noreferrer" className="text-gold hover:underline">
            supabase.com/privacy
          </a>
        </p>
      </>
    ),
  },
  {
    n: "06",
    title: "Cookies",
    body: (
      <p>
        Diese Website verwendet ausschließlich technisch notwendige Speichermechanismen
        (z.B. zur Anmeldung im internen Admin-Bereich). Es werden keine Tracking- oder
        Analyse-Cookies gesetzt und keine Profile gebildet. Lokal gespeicherte Daten können
        Sie in Ihrem Browser jederzeit löschen.
      </p>
    ),
  },
  {
    n: "07",
    title: "WhatsApp",
    body: (
      <>
        <p>
          Wenn Sie uns über WhatsApp kontaktieren, werden Ihre Nachrichten von Meta Platforms Ireland Ltd. verarbeitet.
          Wir empfehlen, keine sensiblen Daten über WhatsApp zu senden.
        </p>
        <p className="mt-3">
          Datenschutzerklärung:{" "}
          <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noreferrer" className="text-gold hover:underline">
            whatsapp.com/legal/privacy-policy
          </a>
        </p>
      </>
    ),
  },
  {
    n: "08",
    title: "Beschwerderecht",
    body: (
      <>
        <p>
          Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer Daten zu beschweren.
        </p>
        <p className="mt-3">
          Zuständige Behörde für Baden-Württemberg:<br />
          Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg<br />
          <a href="https://www.baden-wuerttemberg.datenschutz.de" target="_blank" rel="noreferrer" className="text-gold hover:underline">
            baden-wuerttemberg.datenschutz.de
          </a>
        </p>
      </>
    ),
  },
  {
    n: "09",
    title: "Speicherdauer",
    body: (
      <>
        <p>
          Kontaktformular-Daten: bis zur Erledigung Ihrer Anfrage, danach gesetzliche Aufbewahrungsfristen (max. 10 Jahre).
          Cookies: je nach Typ 1 Tag bis 2 Jahre.
        </p>
        <p className="mt-3">
          Sie können jederzeit die Löschung Ihrer Daten beantragen unter:{" "}
          <a href="mailto:info@schwarzesgoldtyre.com" className="text-gold hover:underline">
            info@schwarzesgoldtyre.com
          </a>
        </p>
      </>
    ),
  },
];

function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-40 pb-32 px-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors mb-10">
            <ArrowLeft className="w-4 h-4" /> Zurück zur Startseite
          </Link>

          <div className="label-eyebrow mb-4">— Rechtliches</div>
          <h1 className="font-display text-5xl md:text-6xl mb-12">
            Daten<span className="gradient-gold-text">schutzerklärung</span>
          </h1>

          <div className="gold-divider mb-12" />

          <div className="space-y-14">
            {sections.map((s) => (
              <section key={s.n} className="grid grid-cols-[auto_1fr] gap-6">
                <div className="font-display text-3xl text-gold/80">{s.n}</div>
                <div>
                  <h2 className="font-display text-2xl text-foreground mb-3 tracking-wide">{s.title}</h2>
                  <div className="text-foreground/90 leading-relaxed">{s.body}</div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
