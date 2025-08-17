// app/api/billing/checkout/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

// Mappe un plan fonctionnel -> Price ID Stripe (env)
const PRICE = {
  proprietaire: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROPRIETAIRE,
  premium: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM,
  business: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS,
} as const;

type PlanKey = keyof typeof PRICE;

function planToPriceId(plan?: string | null) {
  const key = (plan || "").toLowerCase().trim() as PlanKey;
  const priceId = PRICE[key];
  return priceId || null;
}

// Next 15 : headers() est async
async function buildBaseUrl() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const plan = searchParams.get("plan");
    const priceId = planToPriceId(plan);

    if (!priceId) {
      return NextResponse.json(
        { ok: false, error: "Plan inconnu ou non configuré." },
        { status: 400 },
      );
    }

    const base = await buildBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${base}/compte/abonnement?checkout=success`,
      cancel_url: `${base}/tarifs?checkout=canceled`,
      // tu peux ajouter : customer_email, metadata, etc.
      allow_promotion_codes: true,
    });

    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Erreur serveur" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    let plan: string | null = null;

    // Accepte JSON ou form-data
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      plan = body?.plan ?? null;
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const fd = await req.formData();
      plan = (fd.get("plan") as string) ?? null;
    } else {
      // fallback: query string
      const { searchParams } = new URL(req.url);
      plan = searchParams.get("plan");
    }

    const priceId = planToPriceId(plan);
    if (!priceId) {
      return NextResponse.json(
        { ok: false, error: "Plan inconnu ou non configuré." },
        { status: 400 },
      );
    }

    const base = await buildBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${base}/compte/abonnement?checkout=success`,
      cancel_url: `${base}/tarifs?checkout=canceled`,
      allow_promotion_codes: true,
    });

    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Erreur serveur" },
      { status: 500 },
    );
  }
}
