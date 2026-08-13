import { createServerFn } from "@tanstack/react-start";

export type GenerateInput = {
  country: string;
  businessType: string;
  locationMode: "random" | "input";
  city: string;
  leadCount: number;
  websiteFilter: "no-website" | "old-website";
  fields: string[];
};

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

export const signIn = createServerFn({ method: "POST" })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { AUTH_EMAIL, AUTH_PASSWORD } = await import("./airleads.server");
    const ok =
      typeof data?.email === "string" &&
      typeof data?.password === "string" &&
      data.email.trim().toLowerCase() === AUTH_EMAIL &&
      data.password === AUTH_PASSWORD;
    return { ok };
  });

export const generateLeads = createServerFn({ method: "POST" })
  .inputValidator((data: GenerateInput) => data)
  .handler(async ({ data }) => {
    const { WEBHOOK_URL, normalizeLeads, isSuccess } = await import("./airleads.server");

    const body = {
      client_email: "demo@client.com",
      country: (data.country || "India").trim(),
      location_mode: data.locationMode === "input" ? "input" : "random",
      city: data.locationMode === "input" ? (data.city ?? "").trim() : "",
      business_type: (data.businessType ?? "").trim(),
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 120_000);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      const text = await res.text();
      if (!res.ok) {
        return {
          ok: false as const,
          leads: [] as Lead[],
          message: "Lead engine is busy right now. Please try again in a moment.",
        };
      }

      let payload: unknown = null;
      try {
        payload = text ? JSON.parse(text) : null;
      } catch {
        payload = null;
      }

      const leads = normalizeLeads(payload);
      if (payload === null) {
        return {
          ok: false as const,
          leads: [] as Lead[],
          message:
            "Request sent to the automation, but it returned no data. In n8n set the Webhook node to respond with the last node's JSON.",
        };
      }
      if (!isSuccess(payload) || leads.length === 0) {
        return {
          ok: false as const,
          leads: [] as Lead[],
          message: "No leads found, try another city or business type.",
        };
      }

      return { ok: true as const, leads, message: "" };
    } catch (error) {
      const aborted = error instanceof Error && error.name === "AbortError";
      return {
        ok: false as const,
        leads: [] as Lead[],
        message: aborted
          ? "This search took too long. Try a specific city or a narrower business type."
          : "Couldn't reach the lead engine. Check your connection and try again.",
      };
    } finally {
      clearTimeout(timer);
    }
  });
