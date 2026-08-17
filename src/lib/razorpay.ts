import { CREATE_ORDER_URL, RAZORPAY_KEY_ID, VERIFY_PAYMENT_URL, type PlanId } from "./plans";

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  order_id: string;
  amount?: number;
  currency?: string;
  name: string;
  description: string;
  theme?: { color?: string };
  prefill?: { name?: string; email?: string; contact?: string };
  handler: (r: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
};

type RazorpayCtor = new (o: RazorpayOptions) => { open: () => void };

const SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

function loadScript(): Promise<RazorpayCtor> {
  const win = window as unknown as { Razorpay?: RazorpayCtor };
  if (win.Razorpay) return Promise.resolve(win.Razorpay);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT}"]`);
    const el = existing ?? document.createElement("script");
    el.src = SCRIPT;
    el.async = true;
    el.addEventListener("load", () =>
      win.Razorpay ? resolve(win.Razorpay) : reject(new Error("Checkout unavailable")),
    );
    el.addEventListener("error", () => reject(new Error("Could not load Razorpay Checkout")));
    if (!existing) document.body.appendChild(el);
  });
}

/**
 * Full subscription purchase. Only the publishable Key ID is used here — the
 * Key Secret lives exclusively in the n8n backend.
 */
export async function payForPlan(
  planId: PlanId,
  hooks: { onVerifying: () => void; onDismiss: () => void },
): Promise<{ ok: true } | { ok: false; message: string }> {
  const createUrl = CREATE_ORDER_URL;
  const verifyUrl = VERIFY_PAYMENT_URL;
  if (!createUrl || !verifyUrl) {
    return {
      ok: false,
      message:
        "Payment endpoints are not configured yet. Add VITE_CREATE_ORDER_URL and VITE_VERIFY_PAYMENT_URL.",
    };
  }

  let order: { orderId?: string; amount?: number; currency?: string; keyId?: string };
  try {
    const res = await fetch(createUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });
    if (!res.ok) throw new Error(String(res.status));
    order = (await res.json()) as typeof order;
  } catch {
    return { ok: false, message: "Couldn't start the payment. Please try again." };
  }

  const keyId = order.keyId || RAZORPAY_KEY_ID;
  if (!order.orderId || !keyId) {
    return { ok: false, message: "Payment could not be initialised (missing order or key)." };
  }

  let Razorpay: RazorpayCtor;
  try {
    Razorpay = await loadScript();
  } catch {
    return { ok: false, message: "Razorpay Checkout could not load. Check your connection." };
  }

  return new Promise((resolve) => {
    const rzp = new Razorpay({
      key: keyId,
      order_id: order.orderId!,
      ...(order.amount ? { amount: order.amount } : {}),
      currency: order.currency ?? "INR",
      name: "AirLeads AI",
      description: `${planId} plan subscription`,
      theme: { color: "#f97316" },
      prefill: {},
      modal: {
        ondismiss: () => {
          hooks.onDismiss();
          resolve({ ok: false, message: "Payment cancelled before it finished." });
        },
      },
      handler: (r) => {
        hooks.onVerifying();
        void (async () => {
          try {
            const res = await fetch(verifyUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...r, planId }),
            });
            const data = (await res.json().catch(() => ({}))) as {
              success?: boolean;
              message?: string;
            };
            if (!res.ok || data.success === false) {
              resolve({
                ok: false,
                message: data.message || "We couldn't verify this payment. Please try again.",
              });
              return;
            }
            resolve({ ok: true });
          } catch {
            resolve({
              ok: false,
              message: "Payment went through but verification failed. Contact support.",
            });
          }
        })();
      },
    });
    rzp.open();
  });
}
