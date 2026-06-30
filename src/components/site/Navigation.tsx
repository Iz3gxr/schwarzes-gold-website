import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Menu, X, Sun, Moon, Globe, Check, ArrowRight } from "lucide-react";
import logo from "@/assets/logo-transparent.png";
import { useTheme } from "@/lib/theme";
import { useI18n, LANGS, type Lang } from "@/lib/i18n";

type NavLink = { key: string; to: string; hash?: string };

const links: NavLink[] = [
  { key: "nav.home", to: "/" },
  { key: "nav.service", to: "/service" },
  { key: "nav.katalog", to: "/katalog" },
  { key: "nav.about", to: "/", hash: "about" },
  { key: "nav.contact", to: "/", hash: "contact" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const { t, lang, setLang } = useI18n();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); setLangOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pickLang = (l: Lang) => { setLang(l); setLangOpen(false); };

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/85 backdrop-blur-2xl border-b border-border py-2"
          : "bg-transparent backdrop-blur-0 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
          <motion.img
            src={logo}
            alt="Schwarzes Gold"
            className="h-10 md:h-11 w-auto drop-shadow-[0_0_12px_rgba(201,168,76,0.35)]"
            whileHover={{ scale: 1.05, rotate: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
          <span className="hidden sm:inline font-display text-xl md:text-2xl tracking-wider text-foreground">
            SCHWARZES <span className="text-gold">GOLD</span>
          </span>
        </Link>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label={t("nav.theme")}
            className="w-10 h-10 flex items-center justify-center rounded-sm border border-border text-foreground hover:border-gold hover:text-gold transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Sun className="w-5 h-5" />
                </motion.span>
              ) : (
                <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Moon className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => { setLangOpen((v) => !v); setOpen(false); }}
              aria-label={t("nav.language")}
              className="h-10 px-3 flex items-center gap-1.5 rounded-sm border border-border text-foreground hover:border-gold hover:text-gold transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-semibold tracking-wider uppercase">{lang}</span>
            </button>
            <AnimatePresence>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-2 w-44 z-50 glass-card rounded-lg p-1.5 origin-top-right"
                  >
                    {LANGS.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => pickLang(l.code)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-sm text-sm transition-colors ${
                          lang === l.code ? "text-gold" : "text-foreground hover:bg-foreground/5 hover:text-gold"
                        }`}
                      >
                        {l.label}
                        {lang === l.code && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Menu button */}
          <button
            onClick={() => { setOpen((v) => !v); setLangOpen(false); }}
            aria-label={t("nav.menu")}
            className="h-10 px-3 flex items-center gap-2 rounded-sm border border-gold/50 text-gold hover:bg-gold hover:text-background transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span className="hidden sm:inline text-xs uppercase tracking-[0.15em] font-semibold">
              {open ? t("nav.close") : t("nav.menu")}
            </span>
          </button>
        </div>
      </div>

      {/* Menu panel (top-right) */}
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-4 md:right-6 top-full mt-2 z-50 w-[min(86vw,320px)] glass-card rounded-xl p-3 origin-top-right"
            >
              <div className="flex flex-col">
                {links.map((l, i) => (
                  <motion.div
                    key={l.key}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + i * 0.04 }}
                  >
                    <Link
                      to={l.to}
                      hash={l.hash}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-4 py-3 rounded-sm text-foreground hover:bg-foreground/5 hover:text-gold transition-colors font-display text-xl tracking-wide"
                      activeOptions={{ exact: l.to === "/" && !l.hash }}
                      activeProps={{ className: "text-gold" }}
                    >
                      {t(l.key)}
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 transition-all" />
                    </Link>
                  </motion.div>
                ))}
              </div>
              <Link
                to="/"
                hash="contact"
                onClick={() => setOpen(false)}
                className="btn-gold w-full justify-center mt-3"
              >
                {t("nav.cta")} <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
