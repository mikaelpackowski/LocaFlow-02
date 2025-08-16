import { stripe } from "@/lib/stripe";

/**
 * Retourne { active: boolean, customerId?: string, priceId?: string }
 * On identifie le client Stripe par email (NextAuth).
 * NB: stripe.customers.search est + précis ; stripe.customers.list marche aussi.
 */
export async function getSubscriptionStatusByEmail(email: string) {
  // 1) Tenter la recherche (Stripe Search – activé par défaut en test)
  try {
    const search = await stripe.customers.search({
      query: `email:'${email.replace(/'/g, "\\'")}'`,
      limit: 1,
    });
    const customer = search.data[0];
    if (!customer) return { active: false };

    // 2) Lister les subscriptions du customer
    const subs = await stripe.subscriptions.list({
      customer: customer.id,
      status: "all",
      limit: 3,
    });

    const activeSub = subs.data.find((s) => ["active", "trialing"].includes(s.status));
    return {
      active: Boolean(activeSub),
      customerId: customer.id,
      priceId: activeSub?.items?.data?.[0]?.price?.id,
    };
  } catch {
    // Fallback simple (sans search)
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.data[0];
    if (!customer) return { active: false };

    const subs = await stripe.subscriptions.list({
      customer: customer.id,
      status: "all",
      limit: 3,
    });
    const activeSub = subs.data.find((s) => ["active", "trialing"].includes(s.status));
    return {
      active: Boolean(activeSub),
      customerId: customer.id,
      priceId: activeSub?.items?.data?.[0]?.price?.id,
    };
  }
}
