export const WEBHOOK_URL = "https://lissa770.app.n8n.cloud/webhook/airleads-scrape";

export const AUTH_EMAIL = (process.env["APP_LOGIN_EMAIL"] ?? "client@airleads.ai").toLowerCase();
export const AUTH_PASSWORD = process.env["APP_LOGIN_PASSWORD"] ?? "AirLeads@2026";

export type Lead = {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  social: string;
  website: string;
  country: string;
  category: string;
  city: string;
  mapsLink: string;
  instagramLink: string;
  gap: string;
};

function pick(obj: Record<string, unknown>, keys: string[]): string {
  for (const k of Object.keys(obj)) {
    const norm = k.toLowerCase().replace(/[^a-z]/g, "");
    if (keys.includes(norm)) {
      const v = obj[k];
      if (v !== null && v !== undefined && String(v).trim() !== "") return String(v).trim();
    }
  }
  return "";
}

function unwrap(payload: unknown): Record<string, unknown> {
  if (Array.isArray(payload)) return (payload[0] as Record<string, unknown>) ?? {};
  if (payload && typeof payload === "object") return payload as Record<string, unknown>;
  return {};
}

/** true unless the backend explicitly says success: false */
export function isSuccess(payload: unknown): boolean {
  return unwrap(payload)["success"] !== false;
}

export function normalizeLeads(payload: unknown): Lead[] {
  let rows: unknown[] = [];
  if (Array.isArray(payload) && payload.some((r) => r && typeof r === "object" && "business_name" in (r as object))) {
    rows = payload;
  } else {
    const obj = unwrap(payload);
    for (const key of ["leads", "data", "results", "items", "rows"]) {
      if (Array.isArray(obj[key])) {
        rows = obj[key] as unknown[];
        break;
      }
    }
    if (rows.length === 0 && Array.isArray(payload)) rows = payload;
  }

  return rows
    .filter((r): r is Record<string, unknown> => !!r && typeof r === "object")
    .map((r, i) => {
      const instagram = pick(r, ["instagramlink", "instagram", "instagramurl"]);
      const city = pick(r, ["city", "location"]);
      return {
        id: pick(r, ["id", "leadid", "placeid"]) || `lead-${Date.now()}-${i}`,
        businessName: pick(r, ["businessname", "business", "name", "companyname", "company", "title"]),
        ownerName: pick(r, ["ownername", "owner", "contactperson", "contactname", "person"]),
        phone: pick(r, ["phone", "phonenumber", "mobile", "contactnumber", "telephone", "tel"]),
        email: pick(r, ["email", "emailaddress", "mail"]),
        social: instagram || pick(r, ["social", "socialmedia", "facebook", "linkedin", "socials"]),
        website: pick(r, ["website", "url", "site", "webpage", "oldwebsite"]),
        country: city || pick(r, ["country", "address"]),
        category: pick(r, ["category", "businesstype", "type", "industry", "niche"]),
        city,
        mapsLink: pick(r, ["mapslink", "maps", "mapsurl", "googlemaps", "mapurl"]),
        instagramLink: instagram,
        gap: pick(r, ["gap", "why", "reason", "opportunity"]),
      } satisfies Lead;
    })
    .filter((l) => l.businessName || l.phone || l.email);
}
