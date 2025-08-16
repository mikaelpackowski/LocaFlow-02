// app/(default)/compte/abonnement/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { stripe } from "@/lib/stripe";
import Link from "next/link";
import dayjs from "dayjs";
import type Stripe from "stripe"; // ✅ ajoute les types Stripe uniquement

const PRICE = {
  proprietaire: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROPRIETAIRE, // 14 €
  premium: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM,           // 29 €
  business: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS,         // 79 €
} as const;

export const metadata = {
  title: "Mon abonnement – ForGesty",
  description: "Suivi de l’abonnement et gestion via le portail Stripe.",
};

export default async function AbonnementPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return (
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-14 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Mon abonnement</h1>
        <p className="mt-2 text-gray-600">Connectez-vous pour gérer votre abonnement.</p>
        <div className="mt-6 flex justify-center">
          <Link
            href="/auth/login?next=/compte/abonnement"
            className="rounded-full bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-500"
          >
            Se connecter
          </Link>
        </div>
      </main>
    );
  }

  // Stripe: retrouver le customer et son abonnement (si existant)
  const { subscription, customer } = await getStripeSubscription(session.user.email);

  const currentItem = subscription?.items.data[0];
  const planName =
    currentItem?.price?.nickname ??
    mapPriceToLabel(currentItem?.price?.id) ??
    "—";

  const status = subscription?.status ?? "aucun";
  const periodEnd = subscription?.current_period_end
    ? dayjs.unix(subscription.current_period_end).format("DD/MM/YYYY")
    : null;

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
      <h1 className="text-2xl font-bold text-gray-900">Mon abonnement</h1>
      <p className="mt-2 text-gray-600">
        Gérez votre formule et vos factures directement depuis votre espace.
      </p>

      <section className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Statut</h2>

        {subscription ? (
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Info label="Offre" value={planName} />
            <Info label="Statut" value={statusLabel(status)} />
            <Info label="Prochaine échéance" value={periodEnd ?? "—"} />
          </div>
        ) : (
          <p className="mt-2 text-gray-600">Aucun abonnement actif pour le moment.</p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {subscription && customer && (
            <form action="/api/billing/portal" method="POST">
              <button
                type="submit"
                className="rounded-full border px-5 py-2 font-medium hover:bg-gray-50"
              >
                Gérer mon abonnement
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Proposer des actions rapides d’upgrade/downgrade */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900">Changer de plan</h2>
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
          <PlanAction
            title="Propriétaire"
            price="14 € / mois"
            disabled={isSamePrice(subscription, PRICE.proprietaire)}
          >
            {PRICE.proprietaire ? (
              <CheckoutButton priceId={PRICE.proprietaire} />
            ) : (
              <Link
                href="/tarifs"
                className="rounded-full bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-500"
              >
                Voir les tarifs
              </Link>
            )}
          </PlanAction>

          <PlanAction
            title="Premium"
            price="29 € / mois"
            disabled={isSamePrice(subscription, PRICE.premium)}
          >
            {PRICE.premium ? (
              <CheckoutButton priceId={PRICE.premium} />
            ) : (
              <Link
                href="/tarifs"
                className="rounded-full bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-500"
              >
                Voir les tarifs
              </Link>
            )}
          </PlanAction>

          <PlanAction
            title="Business"
            price="79 € / mois"
            disabled={isSamePrice(subscription, PRICE.business)}
          >
            {PRICE.business ? (
              <CheckoutButton priceId={PRICE.business} />
            ) : (
              <Link
                href="/tarifs"
                className="rounded-full bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-500"
              >
                Voir les tarifs
              </Link>
            )}
          </PlanAction>
        </div>
      </section>
    </main>
  );
}

/* -------- utils UI -------- */

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 font-medium text-gray-900">{value}</div>
    </div>
  );
}

function PlanAction({
  title,
  price,
  children,
  disabled,
}: {
  title: string;
  price: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div className={`rounded-2xl border bg-white p-6 ${disabled ? "opacity-60" : ""}`}>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{price}</p>
      <div className="mt-4">{children}</div>
      {disabled && <p className="mt-2 text-xs text-gray-500">Plan actuel</p>}
    </div>
  );
}

function CheckoutButton({ priceId }: { priceId: string }) {
  return (
    <form action="/api/billing/checkout" method="POST">
      <input type="hidden" name="priceId" value={priceId} />
      <input type="hidden" name="mode" value="subscription" />
      <button
        type="submit"
        className="rounded-full bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-500"
      >
        Choisir ce plan
      </button>
    </form>
  );
}

/* -------- utils Stripe -------- */

async function getStripeSubscription(email: string) {
  // retrouve ou crée le customer
  const customers = await stripe.customers.list({ email, limit: 1 });
  const customer = customers.data[0] ?? null;

  if (!customer) {
    return { customer: null, subscription: null };
  }

  // prend l’abonnement le plus pertinent (active / trialing en priorité)
  const list = await stripe.subscriptions.list({
    customer: customer.id,
    status: "all",
    limit: 10,
    expand: ["data.items.data.price.product"],
  });

  const byPriority = (s: Stripe.Subscription) => {
    const order: Record<string, number> = {
      trialing: 0,
      active: 1,
      past_due: 2,
      canceled: 3,
      unpaid: 4,
      incomplete: 5,
      incomplete_expired: 6,
      paused: 7,
    };
    return order[s.status] ?? 99;
  };

  const sorted = list.data.sort((a, b) => byPriority(a) - byPriority(b));
  const subscription = sorted[0] ?? null;

  return { customer, subscription };
}

function isSamePrice(sub: any, priceId?: string) {
  if (!sub || !priceId) return false;
  const current = sub.items?.data?.[0]?.price?.id;
  return current === priceId;
}

function mapPriceToLabel(priceId?: string) {
  if (!priceId) return undefined;
  if (priceId === PRICE.proprietaire) return "Propriétaire";
  if (priceId === PRICE.premium) return "Premium";
  if (priceId === PRICE.business) return "Business";
  return undefined;
}

function statusLabel(status: string) {
  switch (status) {
    case "trialing":
      return "Essai";
    case "active":
      return "Actif";
    case "past_due":
      return "En retard";
    case "canceled":
      return "Annulé";
    case "unpaid":
      return "Impayé";
    default:
      return status;
  }
}
