// app/api/billing/portal/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

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
      return NextResponse.json({ ok: false, error: "Non authentifié." }, { status: 401 });
    }

    // 1) Retrouver (ou créer) le customer Stripe à partir de l'email
    const email = session.user.email;
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customer: Stripe.Customer | null = customers.data[0] ?? null;

    if (!customer) {
      // Option: créer le customer si inexistant
      customer = await stripe.customers.create({ email, name: session.user.name ?? undefined });
    }

    const returnUrl = `${await baseUrl()}/compte/abonnement`;

    // 2) Créer une session Portail client
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: returnUrl,
    });

    return NextResponse.redirect(portalSession.url, { status: 303 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "Erreur serveur" }, { status: 500 });
  }
}
