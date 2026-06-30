import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum — Schwarzes Gold Tyre" },
      { name: "description", content: "Impressum und Anbieterkennzeichnung gemäß § 5 TMG der Schwarzes Gold Reifenhandel UG." },
    ],
  }),
  component: ImpressumPage,
});

function ImpressumPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-40 pb-32 px-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors mb-10">
            <ArrowLeft className="w-4 h-4" /> Zurück zur Startseite
          </Link>

          <div className="label-eyebrow mb-4">— Rechtliches</div>
          <h1 className="font-display text-5xl md:text-6xl mb-3">
            Impres<span className="gradient-gold-text">sum</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-12">Angaben gemäß § 5 TMG</p>

          <div className="gold-divider mb-12" />

          <section className="space-y-10 text-foreground/90 leading-relaxed">
            <div>
              <h2 className="font-display text-2xl text-gold mb-3 tracking-wide">Anbieter</h2>
              <p>
                Schwarzes Gold Reifenhandel UG (haftungsbeschränkt)<br />
                Geschäftsführer: Egor Nikolaenko<br />
                Muggensturmer Landstraße 4-6<br />
                76467 Bietigheim<br />
                Deutschland
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-gold mb-3 tracking-wide">Kontakt</h2>
              <p>
                Telefon: <a href="tel:+4915567167624" className="text-gold hover:underline">+49 15567 167624</a><br />
                E-Mail: <a href="mailto:info@schwarzesgoldtyre.com" className="text-gold hover:underline">info@schwarzesgoldtyre.com</a>
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-gold mb-3 tracking-wide">Registereintrag</h2>
              <p>
                Eingetragen im Handelsregister.<br />
                Registergericht: Amtsgericht Rastatt<br />
                Registernummer: HRB 757018
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-gold mb-3 tracking-wide">Umsatzsteuer-ID</h2>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:<br />
                DE459976606
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-gold mb-3 tracking-wide">Steuernummer</h2>
              <p>39490/21950</p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-gold mb-3 tracking-wide">Haftung für Inhalte</h2>
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den
                allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
                verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen
                zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl text-gold mb-3 tracking-wide">Haftung für Links</h2>
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss
                haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte
                der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
