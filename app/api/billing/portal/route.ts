// app/api/billing/portal/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function baseUrl() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host")!;
  return `${proto}://${host}`;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { ok: false, error: "Non authentifié." },
        { status: 401 }
      );
    }

    const email = session.user.email;

    // 1) Retrouver (ou créer) le customer Stripe via l'email
    const existing = await stripe.customers.list({ email, limit: 1 });
    let customer: Stripe.Customer | null = existing.data[0] ?? null;

    if (!customer) {
      customer = await stripe.customers.create({
        email,
        name: session.user.name ?? undefined,
        metadata: {
          app_user_email: email,
        },
      });
    }

    // 2) Créer la session du portail
    const portal = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${await baseUrl()}/compte/abonnement`,
      // optionnel : limiter/autoriser des fonctionnalités du portail
      // flow_data: { after_completion: { type: "redirect", redirect: { return_url: "..." } } },
    });

    // 3) Redirection 303 vers le portail
    return NextResponse.redirect(portal.url, { status: 303 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

