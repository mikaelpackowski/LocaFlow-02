// app/api/billing/checkout/route.ts
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

    const { priceId, mode = "subscription", successUrl, cancelUrl } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

    const checkout = await stripe.checkout.sessions.create({
      mode, // "subscription" ou "payment"
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: session.user.email,
      success_url: successUrl ?? `${process.env.NEXT_PUBLIC_SITE_URL}/compte/abonnement?status=success`,
      cancel_url: cancelUrl ?? `${process.env.NEXT_PUBLIC_SITE_URL}/tarifs?status=cancel`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: checkout.url }, { status: 200 });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: err.message ?? "Server error" }, { status: 500 });
  }
}
