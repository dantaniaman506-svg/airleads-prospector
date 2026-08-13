import { useState } from "react";
import { Check, ChevronDown, Globe2, Briefcase, Sparkles, Zap, Loader2, RotateCcw, Building2, User, Phone, Mail, Share2, Ban, History as HistoryIcon, MapPin, Shuffle } from "lucide-react";
import { BUSINESS_TYPES, COUNTRIES } from "@/lib/countries";
import { haptic } from "@/lib/haptics";

export type GenerateConfig = {
  country: string;
  businessType: string;
  locationMode: "random" | "input";
  city: string;
  leadCount: number;
  websiteFilter: "no-website" | "old-website";
  fields: string[];
};

const FIELDS = [
  { id: "businessName", label: "Business Name", Icon: Building2 },
  { id: "ownerName", label: "Owner Name", Icon: User },
  { id: "phone", label: "Phone Number", Icon: Phone },
  { id: "email", label: "Email", Icon: Mail },
  { id: "social", label: "Social Media", Icon: Share2 },
];

export function GeneratePanel({
  config,
  setConfig,
  onGenerate,
  loading,
}: {
  config: GenerateConfig;
  setConfig: (c: GenerateConfig) => void;
  onGenerate: () => void;
  loading: boolean;
}) {
  const [countryOpen, setCountryOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const country = COUNTRIES.find((c) => c.name === config.country) ?? COUNTRIES[0]!;

  const toggleField = (id: string) => {
    haptic.select();
    setConfig({
      ...config,
      fields: config.fields.includes(id)
        ? config.fields.filter((f) => f !== id)
        : [...config.fields, id],
    });
  };

  return (
    <section className="card-soft p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            Generate Leads <Sparkles className="size-5 text-primary" />
          </h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Set your filters, AI finds businesses that need a website.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            haptic.tap();
            setConfig({
              country: "India",
              businessType: BUSINESS_TYPES[0]!,
              locationMode: "random",
              city: "",
              leadCount: 100,
              websiteFilter: "no-website",
              fields: FIELDS.map((f) => f.id),
            });
          }}
          className="press flex shrink-0 items-center gap-1.5 rounded-full bg-primary/12 px-3 py-2 text-xs font-bold text-primary"
        >
          <RotateCcw className="size-3.5" /> Reset
        </button>
      </div>

      {/* Country */}
      <div className="mt-5 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Country</p>
        <button
          type="button"
          onClick={() => {
            haptic.tap();
            setCountryOpen((o) => !o);
            setTypeOpen(false);
          }}
          className="press flex w-full items-center gap-3 rounded-xl border border-border bg-secondary/60 px-4 py-3.5"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-primary/12">
            <Globe2 className="size-4.5 text-primary" />
          </span>
          <span className="flex-1 text-left text-[15px] font-semibold">
            <span className="mr-2 text-lg leading-none">{country.flag}</span>
            {country.name}
          </span>
          <ChevronDown className={`size-5 text-muted-foreground transition-transform ${countryOpen ? "rotate-180" : ""}`} />
        </button>
        {countryOpen && (
          <div className="max-h-72 space-y-1 overflow-y-auto rounded-xl border border-border bg-card p-2 shadow-[var(--shadow-soft)]">
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  haptic.select();
                  setConfig({ ...config, country: c.name });
                  setCountryOpen(false);
                }}
                className={`press flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[14px] font-medium ${
                  c.name === config.country ? "bg-primary/12 text-primary" : "hover:bg-secondary"
                }`}
              >
                <span className="text-lg leading-none">{c.flag}</span>
                <span className="flex-1">{c.name}</span>
                {c.name === config.country && <Check className="size-4" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Location */}
      <div className="mt-4 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</p>
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-secondary/40 p-1.5">
          {[
            { id: "random" as const, label: "Random", Icon: Shuffle },
            { id: "input" as const, label: "Enter city", Icon: MapPin },
          ].map(({ id, label, Icon }) => {
            const active = config.locationMode === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  haptic.select();
                  setConfig({ ...config, locationMode: id });
                }}
                className={`press flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-[13px] font-bold transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </button>
            );
          })}
        </div>
        {config.locationMode === "input" && (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/60 px-4 focus-within:border-primary">
            <MapPin className="size-4 shrink-0 text-primary" />
            <input
              value={config.city}
              onChange={(e) => setConfig({ ...config, city: e.target.value })}
              placeholder="e.g. Jaipur"
              aria-label="City"
              className="w-full bg-transparent py-3.5 text-[15px] font-semibold outline-none placeholder:font-medium placeholder:text-muted-foreground"
            />
          </div>
        )}
      </div>

      {/* Business type */}
      <div className="mt-4 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Business Type</p>
        <button
          type="button"
          onClick={() => {
            haptic.tap();
            setTypeOpen((o) => !o);
            setCountryOpen(false);
          }}
          className="press flex w-full items-center gap-3 rounded-xl border border-border bg-secondary/60 px-4 py-3.5"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-primary/12">
            <Briefcase className="size-4.5 text-primary" />
          </span>
          <span className="flex-1 text-left text-[15px] font-semibold">{config.businessType}</span>
          <ChevronDown className={`size-5 text-muted-foreground transition-transform ${typeOpen ? "rotate-180" : ""}`} />
        </button>
        {typeOpen && (
          <div className="max-h-72 space-y-1 overflow-y-auto rounded-xl border border-border bg-card p-2 shadow-[var(--shadow-soft)]">
            {BUSINESS_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  haptic.select();
                  setConfig({ ...config, businessType: t });
                  setTypeOpen(false);
                }}
                className={`press flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[14px] font-medium ${
                  t === config.businessType ? "bg-primary/12 text-primary" : "hover:bg-secondary"
                }`}
              >
                <span className="flex-1">{t}</span>
                {t === config.businessType && <Check className="size-4" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Website filter */}
      <div className="mt-6 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target</p>
        <div className="grid gap-3">
          {[
            { id: "no-website" as const, label: "No Website", desc: "Businesses with zero web presence", Icon: Ban },
            { id: "old-website" as const, label: "Old Website", desc: "Outdated site, needs a rebuild", Icon: HistoryIcon },
          ].map(({ id, label, desc, Icon }) => {
            const active = config.websiteFilter === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  haptic.select();
                  setConfig({ ...config, websiteFilter: id });
                }}
                className={`press flex items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left transition-colors ${
                  active ? "border-primary bg-primary/10" : "border-border bg-secondary/40"
                }`}
              >
                <span className={`grid size-10 place-items-center rounded-xl ${active ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}>
                  <Icon className="size-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-[15px] font-bold">{label}</span>
                  <span className="block text-xs text-muted-foreground">{desc}</span>
                </span>
                <span className={`grid size-5 place-items-center rounded-full border-2 ${active ? "border-primary bg-primary" : "border-border"}`}>
                  {active && <Check className="size-3 text-primary-foreground" strokeWidth={4} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contact details */}
      <div className="mt-6 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact Details</p>
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {FIELDS.map(({ id, label, Icon }) => {
            const active = config.fields.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleField(id)}
                className="press flex w-full items-center gap-3 bg-card px-4 py-3.5 text-left"
              >
                <Icon className={`size-4.5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <span className="flex-1 text-[14px] font-semibold">{label}</span>
                <span
                  className={`grid size-6 place-items-center rounded-lg border-2 transition-colors ${
                    active ? "border-primary bg-primary" : "border-border"
                  }`}
                >
                  {active && <Check className="size-3.5 text-primary-foreground" strokeWidth={4} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lead count */}
      <div className="mt-6 rounded-2xl bg-secondary/60 p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-bold">Leads per generation</p>
          <p className="text-2xl font-extrabold text-primary">{config.leadCount}</p>
        </div>
        <input
          type="range"
          min={0}
          max={1000}
          step={10}
          value={config.leadCount}
          onChange={(e) => setConfig({ ...config, leadCount: Number(e.target.value) })}
          onPointerUp={() => haptic.select()}
          aria-label="Leads per generation"
          className="range-orange mt-3 w-full"
          style={{ ["--pct" as string]: `${(config.leadCount / 1000) * 100}%` }}
        />
        <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
          <span>0</span>
          <span>1000</span>
        </div>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={() => {
          haptic.tap();
          onGenerate();
        }}
        className="btn-glow mt-6 flex w-full items-center justify-center gap-3 rounded-full py-4.5 text-[16px] font-extrabold"
      >
        {loading ? <Loader2 className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
        {loading ? "Generating…" : "Generate Leads"}
        {!loading && (
          <span className="grid size-8 place-items-center rounded-full bg-foreground/15">
            <Zap className="size-4" />
          </span>
        )}
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        AI will find and verify leads based on your preferences
      </p>
    </section>
  );
}
