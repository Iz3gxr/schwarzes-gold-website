import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo-transparent.png";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="relative pt-20 pb-10 px-6 border-t border-border">
      <div className="gold-divider absolute top-0" />
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 group w-fit">
              <motion.img
                src={logo}
                alt="Schwarzes Gold"
                className="h-12 w-auto"
                whileHover={{ scale: 1.05, rotate: -3 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              />
              <span className="font-display text-2xl tracking-wider">
                SCHWARZES <span className="text-gold">GOLD</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              {t("footer.tagline")}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-6">
              Schwarzes Gold Reifenhandel UG (haftungsbeschränkt)
            </p>
          </div>

          <div>
            <div className="label-eyebrow mb-4">{t("footer.contact")}</div>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="tel:+4915567167624" className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors">
                  <Phone className="w-3.5 h-3.5 text-gold" /> +49 15567 167624
                </a>
              </li>
              <li>
                <a href="mailto:info@schwarzesgoldtyre.com" className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors">
                  <Mail className="w-3.5 h-3.5 text-gold" /> info@schwarzesgoldtyre.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-gold mt-0.5 shrink-0" />
                <span>Muggensturmer Landstraße 4-6<br />76467 Bietigheim, Deutschland</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="label-eyebrow mb-4">{t("footer.navigation")}</div>
            <ul className="space-y-2 text-sm">
              <li><Link to="/service" className="text-muted-foreground hover:text-gold transition-colors">{t("footer.service")}</Link></li>
              <li><Link to="/katalog" className="text-muted-foreground hover:text-gold transition-colors">{t("footer.katalog")}</Link></li>
              <li><Link to="/impressum" className="text-muted-foreground hover:text-gold transition-colors">{t("footer.impressum")}</Link></li>
              <li><Link to="/datenschutz" className="text-muted-foreground hover:text-gold transition-colors">{t("footer.datenschutz")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Schwarzes Gold Reifenhandel UG. {t("footer.rights")}
          </p>
          <p className="text-xs uppercase tracking-[0.15em] text-gold/80">
            {t("footer.slogan")}
          </p>
        </div>
      </div>
    </footer>
  );
}
