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

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
      return NextResponse.json({ ok: false, error: "Non authentifié." }, { status: 401 });
    }

    // 1) Retrouver (ou créer) le customer Stripe par email
    const existing = await stripe.customers.list({ email, limit: 1 });
    let customer: Stripe.Customer | null = existing.data[0] ?? null;

    if (!customer) {
      customer = await stripe.customers.create({
        email,
        name: session.user?.name ?? undefined,
        metadata: { app_user_email: email },
      });
    }

    // (Optionnel) pointer une configuration spécifique du portail
    const configuration = process.env.STRIPE_PORTAL_CONFIGURATION_ID || undefined;

    // 2) Créer la session de portail
    const portal = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${await baseUrl()}/compte/abonnement`,
      configuration, // si non défini, Stripe utilise la config par défaut (doit exister en mode test)
    });

    return NextResponse.json({ ok: true, url: portal.url });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        error:
          e?.message ||
          "Erreur serveur. Assure-toi d’avoir enregistré la configuration du portail en mode test dans Stripe.",
      },
      { status: 500 }
    );
  }
}
