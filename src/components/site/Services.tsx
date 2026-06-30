import { motion } from "framer-motion";
import { Truck, Zap, ClipboardList, Wrench, Globe2, MessageCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const services = [
  { icon: Truck, key: "s1", span: "md:col-span-2 md:row-span-2" },
  { icon: Zap, key: "s2", span: "" },
  { icon: ClipboardList, key: "s3", span: "" },
  { icon: Wrench, key: "s4", span: "md:col-span-2" },
  { icon: Globe2, key: "s5", span: "" },
  { icon: MessageCircle, key: "s6", span: "" },
];

export function Services() {
  const { t } = useI18n();
  return (
    <section id="services" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-16 max-w-3xl"
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="label-eyebrow mb-4"
          >
            — {t("services.eyebrow")}
          </motion.div>
          <h2 className="font-display text-5xl md:text-7xl leading-[0.95]">
            {t("services.titlePre")} <span className="gradient-gold-text">{t("services.titleHighlight")}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[220px] gap-4">
          {services.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className={`glass-card rounded-md p-8 flex flex-col justify-between group relative overflow-hidden ${s.span}`}
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gold/5 group-hover:bg-gold/15 blur-3xl transition-all duration-700" />
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-fit"
              >
                <s.icon className="w-8 h-8 text-gold" strokeWidth={1.5} />
              </motion.div>
              <div className="relative z-10">
                <h3 className="font-display text-2xl md:text-3xl tracking-wide mb-2">{t(`services.${s.key}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`services.${s.key}.desc`)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
