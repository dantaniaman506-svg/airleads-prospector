export const LEADS_WEBHOOK_URL =
  "https://lissa770.app.n8n.cloud/webhook/airleads-scrape";

export type Lead = {
  id: number | string;
  businessName: string;
  phone?: string;
  address?: string;
  website?: string;
  email?: string;
  rating?: number;
  reviewsCount?: number;
  category?: string;
  city?: string;
  country?: string;
  hasWebsite?: boolean;
  googleMapsUrl?: string;
  socialMedia?: unknown;
};

export type ScrapeResponse = {
  success?: boolean;
  total?: number;
  leads?: Lead[];
  message?: string;
  error?: string;
};

export type ScrapeInput = {
  country: string;
  location: string;
  businessType: string;
};

/**
 * Calls the n8n backend webhook with a raw JSON body.
 * Long-running (30-60s typical), so the timeout is 90s.
 */
export async function scrapeLeads(input: ScrapeInput): Promise<Lead[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90_000);

  try {
    const response = await fetch(LEADS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        country: input.country,
        location: input.location,
        businessType: input.businessType,
      }),
      signal: controller.signal,
    });

    const raw = await response.text();

    if (!response.ok) {
      throw new Error(
        `Backend returned ${response.status}. ${raw.slice(0, 160) || "No details provided."}`,
      );
    }

    let data: ScrapeResponse | Lead[];
    try {
      data = JSON.parse(raw) as ScrapeResponse | Lead[];
    } catch {
      throw new Error("Backend sent an unreadable response. Please try again.");
    }

    const leads = Array.isArray(data) ? data : (data.leads ?? []);

    if (!Array.isArray(data) && data.success === false) {
      throw new Error(
        data.message || data.error || "The backend could not complete this search.",
      );
    }

    return leads;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(
        "The search took longer than 90 seconds and was stopped. Please try again.",
      );
    }
    if (error instanceof TypeError) {
      throw new Error(
        "Could not reach the lead backend. Check your connection and try again.",
      );
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
