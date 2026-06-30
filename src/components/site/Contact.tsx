import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MessageCircle, MapPin, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";

export function Contact() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [prefilledProduct, setPrefilledProduct] = useState("");

  // Pre-fill product from ?product=... URL param (set when arriving from /katalog)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const p = params.get("product");
    if (p) {
      setPrefilledProduct(p);
      // Smooth scroll handled by hash; ensure visible
      setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const formData = {
      name: String(fd.get("name") || "").trim(),
      company: String(fd.get("company") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      tire_size: String(fd.get("tire_size") || "").trim(),
      quantity: String(fd.get("quantity") || "").trim(),
      product: String(fd.get("product") || "").trim(),
      message: String(fd.get("message") || "").trim(),
    };

    setSuccessMessage("");
    setErrorMessage("");
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .insert([{ ...formData, status: "neu" }]);
    setLoading(false);

    if (error) {
      const reason = [error.message, error.hint].filter(Boolean).join(" — ");
      const message = t("contact.errorPrefix") + reason;
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    console.info("Lead gespeichert", data);
    const message = t("contact.success");
    setSuccessMessage(message);
    toast.success(message);
    form.reset();
    setPrefilledProduct("");
    window.setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <section id="contact" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="label-eyebrow mb-4">— {t("contact.eyebrow")}</div>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mb-8">
              {t("contact.titlePre")} <br />
              <span className="gradient-gold-text">{t("contact.titleHighlight")}</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-12 max-w-md">
              {t("contact.sub")}
            </p>

            <div className="space-y-6">
              {[
                { icon: Phone, label: "contact.labelPhone", value: "+49 15567 167624", href: "tel:+4915567167624" },
                { icon: MessageCircle, label: "WhatsApp", value: "+49 15567 167624", href: "https://wa.me/4915567167624?text=Hallo%2C%20ich%20ben%C3%B6tige%20ein%20Angebot%20f%C3%BCr%20LKW-Reifen." },
                { icon: Mail, label: "contact.labelEmail", value: "info@schwarzesgoldtyre.com", href: "mailto:info@schwarzesgoldtyre.com" },
                { icon: MapPin, label: "contact.labelAddress", value: "Muggensturmer Landstraße 4-6, 76467 Bietigheim" },
              ].map((c) => (
                <a key={c.label} href={c.href ?? undefined} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-sm border border-gold/30 flex items-center justify-center group-hover:bg-gold/10 transition-colors shrink-0">
                    <c.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{t(c.label)}</div>
                    <div className="text-foreground font-medium group-hover:text-gold transition-colors">{c.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-card rounded-md p-5 md:p-8 space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field name="name" label={t("contact.fName")} required />
              <Field name="company" label={t("contact.fCompany")} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field name="phone" label={t("contact.fPhone")} required />
              <Field name="email" label={t("contact.fEmail")} type="email" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field name="tire_size" label={t("contact.fSize")} placeholder="315/80 R22.5" />
              <Field name="quantity" label={t("contact.fQty")} type="number" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 block">
                {t("contact.fProductLabel")}
              </label>
              <input
                name="product"
                defaultValue={prefilledProduct}
                key={prefilledProduct}
                placeholder={t("contact.fProductPlaceholder")}
                className="w-full bg-background border border-border focus:border-gold rounded-sm px-4 py-3 text-foreground outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 block">
                {t("contact.fMessage")}
              </label>
              <textarea
                name="message"
                rows={4}
                className="w-full bg-background border border-border focus:border-gold rounded-sm px-4 py-3 text-foreground outline-none transition-colors"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full justify-center min-h-[52px]">
              {loading ? t("contact.sending") : <>{t("contact.submit")} <ArrowRight className="w-4 h-4" /></>}
            </button>
            {successMessage && (
              <p className="border border-gold/30 bg-gold/10 px-4 py-3 text-center text-sm font-medium text-gold">
                {successMessage}
              </p>
            )}
            {errorMessage && (
              <p className="border border-destructive/30 bg-destructive/10 px-4 py-3 text-center text-sm font-medium text-destructive">
                {errorMessage}
              </p>
            )}
            <p className="text-xs text-muted-foreground text-center">
              {t("contact.privacy")}
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({ name, label, type = "text", required, placeholder }: {
  name: string; label: string; type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 block">
        {label}{required && <span className="text-gold"> *</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full bg-background border border-border focus:border-gold rounded-sm px-4 py-3 text-foreground outline-none transition-colors"
      />
    </div>
  );
}
