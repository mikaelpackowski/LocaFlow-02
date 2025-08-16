import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";
import { getSubscriptionStatusByEmail } from "@/lib/subscription";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const origin = req.headers.get("origin") ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  // Récupérer le customerId via l’email
  const sub = await getSubscriptionStatusByEmail(session.user.email);
  if (!sub.customerId) {
    return NextResponse.json({ error: "No Stripe customer found" }, { status: 400 });
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: sub.customerId,
    return_url: `${origin}/compte/abonnement`,
  });

  return NextResponse.json({ url: portal.url });
}
