// app/api/billing/setup-intent/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data } = await supabase.auth.getUser();
  const uid = data.user?.id;
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // récupérer / créer le customer Stripe lié à l’utilisateur
  const user = await prisma.user.findUnique({ where: { id: uid } });
  let customerId = (user as any)?.stripeCustomerId as string | null;

  if (!customerId) {
    const customer = await stripe.customers.create({ email: user?.email || undefined, name: user?.name || undefined });
    customerId = customer.id;
    await prisma.user.update({ where: { id: uid }, data: { stripeCustomerId: customerId } as any });
  }

  const si = await stripe.setupIntents.create({ customer: customerId, payment_method_types: ["card"] });
  return NextResponse.json({ clientSecret: si.client_secret });
}
