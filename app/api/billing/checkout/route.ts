import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { priceId } = await req.json();
  if (!priceId) return NextResponse.json({ error: "Missing priceId" }, { status: 400 });

  const origin = req.headers.get("origin") ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  // Créer ou réutiliser un customer associé à l’email (Stripe gère la fusion)
  // checkout.sessions.create peut créer le customer à la volée via customer_email
  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: session.user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/compte/abonnement?status=success`,
    cancel_url: `${origin}/tarifs?status=cancel`,
  });

  return NextResponse.json({ url: checkout.url });
}
