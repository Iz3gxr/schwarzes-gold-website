import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Cookie } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function CookieBanner() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("sg-cookie")) setShow(true);
    } catch {
      /* ignore */
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem("sg-cookie", "ok");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 md:right-auto md:left-6 md:max-w-md z-[80] glass-card rounded-xl p-5 shadow-[var(--shadow-gold)]"
          role="dialog"
          aria-label="Cookie"
        >
          <div className="flex items-start gap-3">
            <Cookie className="w-5 h-5 text-gold shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("cookie.text")}{" "}
              <Link to="/datenschutz" className="text-gold hover:underline whitespace-nowrap">
                {t("cookie.more")}
              </Link>
            </p>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={accept} className="btn-gold !py-2 !px-5 !text-xs">
              {t("cookie.accept")}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
