import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Map ENV: tes 3 variables peuvent contenir un price_, un prod_, ou un lookup_key
const PLAN_ENV = {
  proprietaire: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROPRIETAIRE,
  premium: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM,
  business: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS,
} as const;
type PlanKey = keyof typeof PLAN_ENV;

const ALIASES: Record<string, PlanKey> = {
  pro: "premium",
  starter: "proprietaire",
  entreprise: "business",
};

function normalizePlan(input?: string | null): PlanKey | undefined {
  if (!input) return undefined;
  const raw = input.toLowerCase().trim();
  return (ALIASES[raw] ?? raw) as PlanKey;
}

async function baseUrl() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host")!;
  return `${proto}://${host}`;
}

/** Résout une valeur quelconque -> priceId (price_, prod_ -> default_price, lookup_key) */
async function resolvePriceId(value?: string | null): Promise<string | null> {
  const v = (value || "").trim();
  if (!v) return null;

  // 1) Déjà un priceId
  if (v.startsWith("price_")) return v;

  // 2) ProductId -> on récupère default_price
  if (v.startsWith("prod_")) {
    const product = await stripe.products.retrieve(v, { expand: ["default_price"] });
    const dp = product.default_price as string | Stripe.Price | null | undefined;
    if (!dp) return null;
    return typeof dp === "string" ? dp : dp.id ?? null;
  }

  // 3) lookup_key
  const prices = await stripe.prices.list({
    active: true,
    limit: 1,
    lookup_keys: [v],
  });
  return prices.data[0]?.id ?? null;
}

/** Résout plan -> priceId via variables d'env */
async function planToPriceId(plan?: string | null): Promise<string | null> {
  const key = normalizePlan(plan);
  if (!key) return null;
  const configured = PLAN_ENV[key];
  if (!configured) return null;
  return resolvePriceId(configured);
}

function firstDefined<T>(...vals: (T | null | undefined)[]): T | null {
  for (const v of vals) if (v != null) return v as T;
  return null;
}

async function createCheckout(priceId: string) {
  const base = await baseUrl();
  return stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${base}/compte/abonnement?success=true`,
    cancel_url: `${base}/tarifs?checkout=canceled`,
    allow_promotion_codes: true,
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // on accepte ?plan=... ou ?priceId=...
    const plan = searchParams.get("plan");
    const priceParam = searchParams.get("priceId");

    const directPrice = priceParam ? await resolvePriceId(priceParam) : null;
    const planPrice = !directPrice ? await planToPriceId(plan) : null;

    const priceId = firstDefined(directPrice, planPrice);
    if (!priceId) {
      const missing: string[] = [];
      if (!PLAN_ENV.proprietaire) missing.push("NEXT_PUBLIC_STRIPE_PRICE_PROPRIETAIRE");
      if (!PLAN_ENV.premium) missing.push("NEXT_PUBLIC_STRIPE_PRICE_PREMIUM");
      if (!PLAN_ENV.business) missing.push("NEXT_PUBLIC_STRIPE_PRICE_BUSINESS");

      return NextResponse.json(
        {
          ok: false,
          error:
            `Impossible de résoudre un Price ID. ` +
            (plan ? `plan="${plan}". ` : "") +
            (priceParam ? `priceId="${priceParam}". ` : "") +
            (missing.length
              ? `Variables possiblement manquantes: ${missing.join(", ")}. `
              : `Vérifie que la valeur est un price_…, un prod_… (avec default_price) ou un lookup_key actif.`),
        },
        { status: 400 }
      );
    }

    const session = await createCheckout(priceId);
    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    let plan: string | null = null;
    let price: string | null = null;

    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      plan = body?.plan ?? null;
      price = body?.priceId ?? null;
    } else if (ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data")) {
      const fd = await req.formData();
      plan = (fd.get("plan") as string) ?? null;
      price = (fd.get("priceId") as string) ?? null;
    } else {
      const { searchParams } = new URL(req.url);
      plan = searchParams.get("plan");
      price = searchParams.get("priceId");
    }

    const directPrice = price ? await resolvePriceId(price) : null;
    const planPrice = !directPrice ? await planToPriceId(plan) : null;
    const priceId = firstDefined(directPrice, planPrice);

    if (!priceId) {
      return NextResponse.json(
        { ok: false, error: "Impossible de résoudre un Price ID (plan ou priceId invalide)." },
        { status: 400 }
      );
    }

    const session = await createCheckout(priceId);
    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
