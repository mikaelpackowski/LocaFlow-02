// app/api/billing/webhook/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// ⚠️ Renseigne STRIPE_WEBHOOK_SECRET dans tes variables d'env (mode test OU live)
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PlanKey = "proprietaire" | "premium" | "business";

// Renseigne tes mappings (price_ -> plan) si tu veux stocker un libellé lisible
const PRICE_TO_PLAN: Record<string, PlanKey> = {
  // "price_123_proprio": "proprietaire",
  // "price_456_premium": "premium",
  // "price_789_business": "business",
};

async function upsertSubscriptionInDB(params: {
  customerId?: string | null;
  customerEmail?: string | null;
  priceId?: string | null;
  plan?: PlanKey | null;
  status?: string | null;
  currentPeriodEnd?: number | null; // UNIX seconds
  subscriptionId?: string | null;
  metadata?: Record<string, string> | null;
}) {
  // TODO: remplace par ta vraie persistance (Prisma / Supabase / etc.)
  // console.log("UPSERT SUB", params);

  // // Exemple Supabase (admin)
  // import { createClient } from "@supabase/supabase-js";
  // const supabase = createClient(
  //   process.env.SUPABASE_URL!,
  //   process.env.SUPABASE_SERVICE_ROLE_KEY!
  // );
  // await supabase.from("subscriptions").upsert({
  //   stripe_subscription_id: params.subscriptionId,
  //   stripe_customer_id: params.customerId,
  //   customer_email: params.customerEmail,
  //   price_id: params.priceId,
  //   plan: params.plan,
  //   status: params.status,
  //   current_period_end: params.currentPeriodEnd
  //     ? new Date(params.currentPeriodEnd * 1000).toISOString()
  //     : null,
  //   metadata: params.metadata ?? {},
  // }, { onConflict: "stripe_subscription_id" });
}

function planFromPriceId(priceId?: string | null): PlanKey | null {
  if (!priceId) return null;
  return PRICE_TO_PLAN[priceId] ?? null;
}

export async function POST(req: Request) {
  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { ok: false, error: "STRIPE_WEBHOOK_SECRET manquant côté serveur." },
      { status: 500 }
    );
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
      { ok: false, error: "Signature Stripe manquante." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    // Lire le RAW body, pas req.json()
    const raw = await req.text();
    event = stripe.webhooks.constructEvent(raw, sig, WEBHOOK_SECRET);
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: `Signature invalide: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id ?? null;

        const customerEmail =
          (session.customer_details?.email ||
            session.customer_email ||
            null) as string | null;

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : (session.subscription as Stripe.Subscription | null)?.id ?? null;

        // Récupérer la sub pour obtenir priceId / period_end / status
        let priceId: string | null = null;
        let currentPeriodEnd: number | null = null;
        let status: string | null = null;

        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId, {
            expand: ["items.data.price"],
          });
          const priceObj = sub.items.data[0]?.price || null;
          priceId = typeof priceObj === "string" ? priceObj : priceObj?.id ?? null;
          currentPeriodEnd = sub.current_period_end ?? null;
          status = sub.status ?? null;
        } else if (session.mode === "subscription") {
          // Fallback : tenter via les line items
          const lines = await stripe.checkout.sessions.listLineItems(session.id, {
            limit: 1,
            expand: ["data.price"],
          });
          const priceObj = lines.data[0]?.price || null;
          priceId = typeof priceObj === "string" ? priceObj : priceObj?.id ?? null;
        }

        await upsertSubscriptionInDB({
          customerId,
          customerEmail,
          priceId,
          plan: planFromPriceId(priceId),
          status,
          currentPeriodEnd,
          subscriptionId,
          metadata: (session.metadata ?? {}) as Record<string, string>,
        });

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        const customerId =
          typeof sub.customer === "string"
            ? sub.customer
            : sub.customer?.id ?? null;

        const priceObj = sub.items.data[0]?.price || null;
        const priceId = typeof priceObj === "string" ? priceObj : priceObj?.id ?? null;

        await upsertSubscriptionInDB({
          customerId,
          customerEmail: null, // si besoin, stripe.customers.retrieve(customerId)
          priceId,
          plan: planFromPriceId(priceId),
          status: sub.status ?? null,
          currentPeriodEnd: sub.current_period_end ?? null,
          subscriptionId: sub.id,
          metadata: (sub.metadata ?? {}) as Record<string, string>,
        });

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        // subscription et customer peuvent être string ou objets
        const subId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id ?? null;

        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id ?? null;

        // 1) Essayer de lire le price depuis la 1ère ligne de la facture
        let priceId: string | null = null;
        const firstLine = invoice.lines?.data?.[0];
        const firstLinePrice = firstLine?.price as Stripe.Price | string | null | undefined;
        if (firstLinePrice) {
          priceId =
            typeof firstLinePrice === "string" ? firstLinePrice : firstLinePrice.id ?? null;
        }

        // 2) Fallback : si pas de price dans l'event, aller le chercher sur la subscription
        if (!priceId && subId) {
          const sub = await stripe.subscriptions.retrieve(subId, {
            expand: ["items.data.price"],
          });
          const p = sub.items.data[0]?.price;
          priceId = (typeof p === "string" ? p : p?.id) ?? null;
        }

        await upsertSubscriptionInDB({
          customerId,
          customerEmail: invoice.customer_email || null,
          priceId,
          plan: planFromPriceId(priceId),
          status: "payment_failed",
          currentPeriodEnd: null,
          subscriptionId: subId,
          metadata: (invoice.metadata ?? {}) as Record<string, string>,
        });

        break;
      }

      default: {
        // Non géré explicitement, OK
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Erreur serveur webhook" },
      { status: 500 }
    );
  }
}
