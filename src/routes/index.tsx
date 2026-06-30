import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/site/Navigation";
import { Hero } from "@/components/site/Hero";
import { Brands } from "@/components/site/Brands";
import { Services } from "@/components/site/Services";
import { Process } from "@/components/site/Process";
import { Showcase } from "@/components/site/Showcase";
import { ScrollStory } from "@/components/site/ScrollStory";
import { TruckNavigator } from "@/components/site/TruckNavigator";
import { Catalog } from "@/components/site/Catalog";
import { About } from "@/components/site/About";
import { Testimonials } from "@/components/site/Testimonials";
import { Stats } from "@/components/site/Stats";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { LoadingScreen } from "@/components/site/LoadingScreen";
import { CustomCursor } from "@/components/site/CustomCursor";
import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Schwarzes Gold Tyre — Premium LKW-Reifen, schnelle Lieferung" },
      { name: "description", content: "Premium LKW & Nutzfahrzeugreifen Spezialist. Lieferung meist 1–2 Tage EU-weit, oft am selben Tag. Schnelle Antwort." },
      { property: "og:title", content: "Schwarzes Gold Tyre — Präzision. Stärke. Vertrauen." },
      { property: "og:description", content: "Premium LKW-Reifen. Lieferung meist 1–2 Tage, oft am selben Tag. Schnelle Antwort." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  const { theme } = useTheme();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LoadingScreen />
      <CustomCursor />
      <Navigation />
      <main>
        <Hero />
        <ScrollStory />
        <Brands />
        <Services />
        <Process />
        <Showcase />
        <TruckNavigator />
        <Catalog />
        <About />
        <Testimonials />
        <Stats />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <Toaster theme={theme} position="bottom-center" />
    </div>
  );
}
