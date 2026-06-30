import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase, type Lead, type Product, PRODUCT_CATEGORIES } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Schwarzes Gold" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const STATUSES = ["neu", "in_bearbeitung", "kontaktiert", "abgeschlossen", "archiviert"];
const PRODUCT_STATUSES = ["Sofort verfügbar", "Auf Anfrage"];

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Lädt…
      </div>
    );
  }

  if (!session) return <LoginForm />;

  return <Dashboard onLogout={() => supabase.auth.signOut()} />;
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pwd });
    setLoading(false);
    if (error) toast.error("Login fehlgeschlagen: " + error.message);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <form onSubmit={submit} className="glass-card rounded-md p-8 w-full max-w-sm space-y-4">
        <h1 className="font-display text-3xl text-gold tracking-wider text-center">ADMIN</h1>
        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground text-center">
          Schwarzes Gold Dashboard
        </p>
        <input
          type="email"
          autoFocus
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-Mail"
          className="w-full bg-background border border-border focus:border-gold rounded-sm px-4 py-3 text-foreground outline-none"
        />
        <input
          type="password"
          required
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="Passwort"
          className="w-full bg-background border border-border focus:border-gold rounded-sm px-4 py-3 text-foreground outline-none"
        />
        <button type="submit" disabled={loading} className="btn-gold w-full justify-center">
          {loading ? "Anmelden…" : "Anmelden"}
        </button>
      </form>
    </div>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"leads" | "products">("leads");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-20 bg-background/80 backdrop-blur">
        <div className="flex items-center gap-8">
          <div>
            <div className="font-display text-2xl text-gold tracking-wider">SG ADMIN</div>
          </div>
          <nav className="flex gap-2">
            {(["leads", "products"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.15em] rounded-sm border transition-colors ${
                  tab === t ? "bg-gold text-background border-gold" : "border-border text-muted-foreground hover:border-gold/50"
                }`}
              >
                {t === "leads" ? "Leads" : "Produkte"}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={onLogout} className="btn-outline-gold !py-2 !px-4 !text-xs">Logout</button>
      </header>
      {tab === "leads" ? <LeadsTab /> : <ProductsTab />}
    </div>
  );
}

function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setLeads((data as Lead[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const prev = leads;
    setLeads((l) => l.map((x) => (x.id === id ? { ...x, status } : x)));
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) { setLeads(prev); toast.error(error.message); }
    else toast.success("Status aktualisiert");
  };

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  return (
    <div className="px-6 py-6">
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-sm text-xs uppercase tracking-[0.15em] border transition-colors ${
              filter === s ? "bg-gold text-background border-gold" : "border-border text-muted-foreground hover:border-gold/50"
            }`}
          >
            {s === "all" ? "Alle" : s}
            {s !== "all" && <span className="ml-2 opacity-60">{leads.filter((l) => l.status === s).length}</span>}
          </button>
        ))}
        <button onClick={load} className="ml-auto px-4 py-2 text-xs uppercase tracking-[0.15em] text-gold hover:underline">
          Neu laden
        </button>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground py-20">Lädt...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-muted-foreground py-20">Keine Leads</div>
      ) : (
        <div className="overflow-x-auto glass-card rounded-md">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.15em] text-muted-foreground border-b border-border">
                <th className="px-4 py-3">Datum</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Firma</th>
                <th className="px-4 py-3">Kontakt</th>
                <th className="px-4 py-3">Reifen / Produkt</th>
                <th className="px-4 py-3">Nachricht</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-border/40 hover:bg-surface/40">
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(l.created_at).toLocaleString("de-DE", {
                      day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 font-medium">{l.name || "—"}</td>
                  <td className="px-4 py-3">{l.company || "—"}</td>
                  <td className="px-4 py-3">
                    {l.phone && <div><a href={`tel:${l.phone}`} className="text-gold hover:underline">{l.phone}</a></div>}
                    {l.email && <div className="text-xs text-muted-foreground"><a href={`mailto:${l.email}`} className="hover:text-gold">{l.email}</a></div>}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {l.product && <div className="text-gold">{l.product}</div>}
                    {l.tire_size && <div>{l.tire_size}</div>}
                    {l.quantity && <div className="text-muted-foreground">×{l.quantity}</div>}
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="line-clamp-2 text-muted-foreground text-xs">{l.message || "—"}</div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={l.status}
                      onChange={(e) => updateStatus(l.id, e.target.value)}
                      className="bg-background border border-border rounded-sm px-2 py-1 text-xs text-foreground focus:border-gold outline-none"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showNew, setShowNew] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("category", { ascending: true });
    if (error) toast.error(error.message + " · Tabelle 'products' existiert?");
    else setProducts((data as Product[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Produkt löschen?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Gelöscht"); load(); }
  };

  const filtered = filter === "all" ? products : products.filter((p) => p.category === filter);

  return (
    <div className="px-6 py-6">
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-2 rounded-sm text-xs uppercase tracking-[0.15em] border transition-colors ${
            filter === "all" ? "bg-gold text-background border-gold" : "border-border text-muted-foreground hover:border-gold/50"
          }`}
        >Alle</button>
        {PRODUCT_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3 py-2 rounded-sm text-xs uppercase tracking-[0.15em] border transition-colors ${
              filter === c ? "bg-gold text-background border-gold" : "border-border text-muted-foreground hover:border-gold/50"
            }`}
          >{c}</button>
        ))}
        <button onClick={() => setShowNew(true)} className="ml-auto btn-gold !py-2 !px-4 !text-xs">+ Neues Produkt</button>
        <button onClick={load} className="px-4 py-2 text-xs uppercase tracking-[0.15em] text-gold hover:underline">
          Neu laden
        </button>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground py-20">Lädt...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-muted-foreground py-20">
          Keine Produkte. Tabelle anlegen und über „+ Neues Produkt" hinzufügen.
        </div>
      ) : (
        <div className="overflow-x-auto glass-card rounded-md">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.15em] text-muted-foreground border-b border-border">
                <th className="px-4 py-3">Kategorie</th>
                <th className="px-4 py-3">Marke</th>
                <th className="px-4 py-3">Produkt</th>
                <th className="px-4 py-3">Bild-URL</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setEditing(p)}
                  className="border-b border-border/40 hover:bg-surface/40 cursor-pointer"
                >
                  <td className="px-4 py-3 text-xs text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3 text-gold">{p.brand}</td>
                  <td className="px-4 py-3 font-medium">{p.product_name}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">{p.image_url || "—"}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className={p.status === "Sofort verfügbar" ? "text-emerald-400" : "text-gold"}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); remove(p.id); }}
                      className="text-xs text-destructive hover:underline"
                    >Löschen</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(editing || showNew) && (
        <ProductEditor
          product={editing}
          onClose={() => { setEditing(null); setShowNew(false); }}
          onSaved={() => { setEditing(null); setShowNew(false); load(); }}
        />
      )}
    </div>
  );
}

function ProductEditor({ product, onClose, onSaved }: {
  product: Product | null; onClose: () => void; onSaved: () => void;
}) {
  const [form, setForm] = useState({
    category: product?.category ?? PRODUCT_CATEGORIES[0],
    brand: product?.brand ?? "",
    product_name: product?.product_name ?? "",
    status: product?.status ?? "Sofort verfügbar",
    description: product?.description ?? "",
    price: product?.price != null ? String(product.price) : "",
  });
  // Galerie: vorhandenes Hauptbild + weitere Bilder zusammenführen (dedupliziert).
  const [images, setImages] = useState<string[]>(() => {
    const arr = [product?.image_url, ...(product?.images ?? [])].filter(Boolean) as string[];
    return [...new Set(arr)];
  });
  const [specs, setSpecs] = useState<{ k: string; v: string }[]>(() =>
    Object.entries(product?.specs ?? {}).map(([k, v]) => ({ k, v: String(v) })),
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const added: string[] = [];
    for (const file of Array.from(files)) {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) { toast.error(`Upload fehlgeschlagen: ${error.message}`); continue; }
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      if (data?.publicUrl) added.push(data.publicUrl);
    }
    if (added.length) setImages((prev) => [...new Set([...prev, ...added])]);
    setUploading(false);
  };

  const removeImage = (url: string) => setImages((prev) => prev.filter((u) => u !== url));
  const makePrimary = (url: string) => setImages((prev) => [url, ...prev.filter((u) => u !== url)]);

  const save = async () => {
    if (!form.brand.trim() || !form.product_name.trim()) {
      toast.error("Marke und Produktname sind Pflicht.");
      return;
    }
    setSaving(true);
    const specsObj = Object.fromEntries(
      specs.map((s) => [s.k.trim(), s.v.trim()]).filter(([k, v]) => k && v),
    );
    const priceRaw = form.price.replace(",", ".").trim();
    const priceNum = priceRaw === "" ? null : Number(priceRaw);
    const payload = {
      category: form.category,
      brand: form.brand.trim(),
      product_name: form.product_name.trim(),
      status: form.status,
      description: form.description.trim() || null,
      image_url: images[0] ?? null,       // erstes Bild = Hauptbild / Thumbnail
      images,                              // komplette Galerie
      specs: specsObj,
      price: priceNum != null && !Number.isNaN(priceNum) ? priceNum : null,
    };
    const { error } = product
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert([payload]);
    setSaving(false);
    if (error) toast.error(error.message);
    else { toast.success(product ? "Aktualisiert" : "Hinzugefügt"); onSaved(); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur flex items-center justify-center p-6" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="glass-card rounded-md p-8 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="font-display text-2xl text-gold tracking-wider">
          {product ? "Produkt bearbeiten" : "Neues Produkt"}
        </h2>
        <div>
          <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block">Kategorie</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full bg-background border border-border focus:border-gold rounded-sm px-3 py-2 text-foreground outline-none"
          >
            {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <Input label="Marke" value={form.brand} onChange={(v) => setForm({ ...form, brand: v })} />
        <Input label="Produktname" value={form.product_name} onChange={(v) => setForm({ ...form, product_name: v })} />

        {/* Bilder-Galerie mit Upload */}
        <div>
          <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block">Bilder</label>
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mb-3">
              {images.map((url, i) => (
                <div key={url} className="relative group rounded-sm overflow-hidden border border-border aspect-square">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 text-[9px] uppercase tracking-wider bg-gold text-background px-1.5 py-0.5 rounded-sm">
                      Haupt
                    </span>
                  )}
                  <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-[10px]">
                    {i !== 0 && (
                      <button onClick={() => makePrimary(url)} className="text-gold hover:underline">Als Haupt</button>
                    )}
                    <button onClick={() => removeImage(url)} className="text-destructive hover:underline">Entfernen</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <label className="block w-full text-center text-xs uppercase tracking-[0.15em] py-3 border border-dashed border-gold/40 text-gold hover:bg-gold/10 transition-colors rounded-sm cursor-pointer">
            {uploading ? "Lädt hoch…" : "+ Bilder hochladen"}
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={(e) => { upload(e.target.files); e.target.value = ""; }}
              className="hidden"
            />
          </label>
          <p className="text-[10px] text-muted-foreground mt-1">
            Erstes Bild = Vorschaubild im Katalog. Mehrere Bilder = Galerie auf der Produktseite.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full bg-background border border-border focus:border-gold rounded-sm px-3 py-2 text-foreground outline-none"
            >
              {PRODUCT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Input
            label="Preis € (leer = auf Anfrage)"
            value={form.price}
            onChange={(v) => setForm({ ...form, price: v })}
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block">Beschreibung (optional)</label>
          <textarea
            rows={3}
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-background border border-border focus:border-gold rounded-sm px-3 py-2 text-foreground outline-none"
          />
        </div>

        {/* Technische Daten (Schlüssel/Wert) */}
        <div>
          <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block">Technische Daten</label>
          <div className="space-y-2">
            {specs.map((s, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={s.k}
                  placeholder="z.B. Dimension"
                  onChange={(e) => setSpecs((p) => p.map((x, i) => i === idx ? { ...x, k: e.target.value } : x))}
                  className="w-2/5 bg-background border border-border focus:border-gold rounded-sm px-3 py-2 text-sm text-foreground outline-none"
                />
                <input
                  value={s.v}
                  placeholder="z.B. 315/80 R22.5"
                  onChange={(e) => setSpecs((p) => p.map((x, i) => i === idx ? { ...x, v: e.target.value } : x))}
                  className="flex-1 bg-background border border-border focus:border-gold rounded-sm px-3 py-2 text-sm text-foreground outline-none"
                />
                <button
                  onClick={() => setSpecs((p) => p.filter((_, i) => i !== idx))}
                  className="px-2 text-destructive text-sm hover:underline shrink-0"
                  aria-label="Zeile entfernen"
                >✕</button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setSpecs((p) => [...p, { k: "", v: "" }])}
            className="mt-2 text-xs uppercase tracking-[0.15em] text-gold hover:underline"
          >+ Zeile hinzufügen</button>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-outline-gold flex-1 justify-center">Abbrechen</button>
          <button onClick={save} disabled={saving || uploading} className="btn-gold flex-1 justify-center">
            {saving ? "Speichert..." : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-1 block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-background border border-border focus:border-gold rounded-sm px-3 py-2 text-foreground outline-none"
      />
    </div>
  );
}
