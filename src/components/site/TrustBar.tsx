const brands = [
  "CONTINENTAL", "MICHELIN", "BRIDGESTONE", "GOODYEAR",
  "PIRELLI", "FULDA", "HANKOOK", "DUNLOP", "NOKIAN", "YOKOHAMA",
];

export function TrustBar() {
  return (
    <section className="relative py-16 border-y border-border/60 overflow-hidden bg-surface/30">
      <div className="text-center mb-10">
        <div className="label-eyebrow">Vertrauen von führenden Speditionen</div>
      </div>
      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...brands, ...brands].map((b, i) => (
            <span
              key={i}
              className="font-display text-2xl md:text-3xl tracking-[0.3em] text-muted-foreground/60 hover:text-gold transition-colors mx-12"
            >
              {b}
            </span>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
