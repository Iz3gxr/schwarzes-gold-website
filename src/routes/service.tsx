import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Navigation } from "@/components/site/Navigation";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/service")({
  head: () => ({
    meta: [
      { title: "Unser Service — Reifen, Teile, Vor-Ort-Reparatur | Schwarzes Gold" },
      { name: "description", content: "Kompletter LKW-Service: Premium-Reifen, Originalteile und mobile Vor-Ort-Reparatur — alles aus einer Hand." },
      { property: "og:title", content: "Unser Service — Schwarzes Gold" },
      { property: "og:description", content: "Reifen, Teile, Reparatur — alles aus einer Hand." },
    ],
  }),
  component: ServicePage,
});

const services = [
  { icon: "🛞", key: "c1", to: "/katalog" },
  { icon: "🔧", key: "c2", to: "/katalog" },
  { icon: "🚚", key: "c3", to: "/", hash: "contact" },
] as const;

function ServicePage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted-foreground mb-8"
          >
            <Link to="/" className="hover:text-gold">{t("nav.home")}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gold">{t("nav.service")}</span>
          </motion.nav>

          {/* Hero */}
          <div className="max-w-4xl mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="label-eyebrow mb-5"
            >
              — {t("nav.service")}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight"
            >
              {t("service.titlePre")}{" "}
              <span className="gradient-gold-text">{t("service.titleHighlight")}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl"
            >
              {t("service.sub")}
            </motion.p>
          </div>

          {/* Service cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8 }}
                className="glass-card rounded-md p-8 flex flex-col h-full relative overflow-hidden group hover:shadow-[0_0_60px_-10px_var(--gold)] transition-shadow duration-500"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(circle at 50% 0%, var(--gold) -150%, transparent 60%)" }} />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="text-5xl mb-6">{s.icon}</div>
                  <h3 className="font-display text-3xl tracking-wide mb-4">
                    {t(`service.${s.key}.title`)}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-8 flex-1">
                    {t(`service.${s.key}.desc`)}
                  </p>
                  <Link
                    to={s.to}
                    hash={"hash" in s ? (s as { hash?: string }).hash : undefined}
                    className="btn-outline-gold self-start"
                  >
                    {t(`service.${s.key}.cta`)} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-24 text-center"
          >
            <p className="text-muted-foreground mb-6">
              {t("service.bottomText")}
            </p>
            <Link to="/" hash="contact" className="btn-gold">
              {t("service.bottomCta")} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
