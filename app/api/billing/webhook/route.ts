// app/api/billing/webhook/route.ts
import Stripe from "stripe";              // ⬅️ manquait
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// ⚠️ Renseigne STRIPE_WEBHOOK_SECRET dans tes variables d'env (mode test OU live)
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PlanKey = "proprietaire" | "premium" | "business";

// Map pour convertir un priceId -> plan (si tu veux stocker le plan lisible côté base)
const PRICE_TO_PLAN: Record<string, PlanKey> = {
  // Exemple :
  // "price_1QxxxTest": "proprietaire",
  // "price_1QyyyTest": "premium",
  // "price_1QzzzTest": "business",
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
  // =========================
  // OPTION A — À FAIRE PLUS TARD :
  // =========================
  // TODO: remplace par ta vraie persistance (Prisma / Supabase / etc.)
  // console.log("UPSERT SUB", params);

  // =========================
  // OPTION B — SUPABASE (exemple admin) :
  // =========================
  // import { createClient } from "@supabase/supabase-js";
  // const supabase = createClient(
  //   process.env.SUPABASE_URL!,
  //   process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ service_role côté serveur seulement
  // );
  // await supabase.from("subscriptions").upsert({
  //   stripe_subscription_id: params.subscriptionId,
  //   stripe_customer_id: params.customerId,
  //   customer_email: params.customerEmail,
  //   price_id: params.priceId,
  //   plan: params.plan,
  //   status: params.status,
  //   current_period_end: params.currentPeriodEnd ? new Date(params.currentPeriodEnd * 1000).toISOString() : null,
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
    return NextResponse.json({ ok: false, error: "Signature Stripe manquante." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const raw = await req.text();
    event = stripe.webhooks.constructEvent(raw, sig, WEBHOOK_SECRET);
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: `Signature invalide: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Infos utiles
        const customerId = session.customer?.toString() ?? null;
        const customerEmail = (session.customer_details?.email || session.customer_email || null) as string | null;
        const subscriptionId = session.subscription?.toString() ?? null;

        // Récupérer la sub pour avoir priceId / period_end, etc.
        let priceId: string | null = null;
        let currentPeriodEnd: number | null = null;
        let status: string | null = null;

        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId, { expand: ["items.data.price"] });
          const priceObj = sub.items.data[0]?.price || null;
          priceId = typeof priceObj === "string" ? priceObj : priceObj?.id ?? null;
          currentPeriodEnd = sub.current_period_end ?? null;
          status = sub.status ?? null;
        } else if (session.mode === "subscription" && session.line_items == null) {
          // Fallback : si besoin, on peut lister les line_items
          const lines = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
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

      case "customer.subscription.updated":
      case "customer.subscription.created":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer?.toString() ?? null;
        const priceObj = sub.items.data[0]?.price || null;
        const priceId = typeof priceObj === "string" ? priceObj : priceObj?.id ?? null;

        await upsertSubscriptionInDB({
          customerId,
          customerEmail: null, // récupérable via stripe.customers.retrieve(customerId)
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
        const subId = invoice.subscription?.toString() ?? null;
        const customerId = invoice.customer?.toString() ?? null;
        const priceId = typeof invoice.price === "string" ? invoice.price : invoice.price?.id ?? null;

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

      default:
        // Tu peux logger pour audit si tu veux
        // console.log(`Unhandled event type ${event.type}`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Erreur serveur webhook" }, { status: 500 });
  }
}
