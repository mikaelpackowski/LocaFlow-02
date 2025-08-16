// app/api/billing/portal/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ⚠️ ici il faudrait idéalement retrouver le customer Stripe lié à l’utilisateur
    // via ta DB (Prisma : user.stripeCustomerId). Pour la démo, on crée un customer
    // “temporaire” avec l’email si besoin.
    const customers = await stripe.customers.list({ email: session.user.email, limit: 1 });
    const customer =
      customers.data[0] ??
      (await stripe.customers.create({
        email: session.user.email,
        name: session.user.name ?? undefined,
      }));

    const portal = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/compte/abonnement`,
    });

    return NextResponse.json({ url: portal.url }, { status: 200 });
  } catch (err: any) {
    console.error("Portal error:", err);
    return NextResponse.json({ error: err.message ?? "Server error" }, { status: 500 });
  }
}
