// app/(default)/tarifs/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import Link from "next/link";

/**
 * Si tu veux activer Stripe tout de suite, renseigne tes Price IDs ici
 * (optionnel, sinon les boutons mènent vers la connexion / le compte).
 */
const PRICE = {
  proprietaire: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROPRIETAIRE, // 14 €
  premium: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM,           // 29 €
  business: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS,         // 79 €
};

export const metadata = {
  title: "Tarifs – ForGesty",
  description:
    "Des plans clairs pour propriétaires et agences. Commencez gratuitement, évoluez quand vous le souhaitez.",
};

export default async function TarifsPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Tarifs <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">ForGesty</span>
        </h1>
        <p className="mt-3 text-gray-600">
          Des plans clairs pour propriétaires et agences. Commencez gratuitement,
          évoluez quand vous le souhaitez.
        </p>
      </header>

      {/* ====== Bloc 1: Pour propriétaires ====== */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold text-gray-900">Pour propriétaires</h2>
        <p className="text-sm text-gray-600">
          Idéal pour gérer quelques biens simplement et efficacement.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Gratuit */}
          <PlanCard
            title="Gratuit"
            price="0 €"
            sub="/mois"
            features={[
              "1 bien",
              "Quittances manuelles",
              "Documents de base",
              "Découverte de la plateforme",
            ]}
            cta={
              session ? (
                <Link
                  href="/compte/abonnement"
                  className="w-full rounded-full border px-5 py-2 font-medium hover:bg-gray-50 text-center"
                >
                  Essayer
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="w-full rounded-full border px-5 py-2 font-medium hover:bg-gray-50 text-center"
                >
                  Essayer
                </Link>
              )
            }
          />

          {/* Propriétaire 14 € — Populaire */}
          <PlanCard
            title="Propriétaire"
            price="14 €"
            sub="/mois"
            badge="Populaire"
            highlighted
            features={[
              "Jusqu'à 5 biens",
              "Quittances automatiques",
              "Paiement en ligne",
              "Aide IA intégrée",
              "Support standard",
            ]}
            cta={
              session ? (
                priceButton(PRICE.proprietaire, "Commencer")
              ) : (
                <Link
                  href="/auth/login?next=/tarifs"
                  className="w-full rounded-full bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-500 text-center"
                >
                  Commencer
                </Link>
              )
            }
          />

          {/* Premium 29 € */}
          <PlanCard
            title="Premium"
            price="29 €"
            sub="/mois"
            features={[
              "Jusqu'à 15 biens",
              "Relances & rappels automatiques",
              "Gestion artisans & interventions",
              "Documents illimités",
              "Support prioritaire",
            ]}
            cta={
              session ? (
                priceButton(PRICE.premium, "Essayer")
              ) : (
                <Link
                  href="/auth/login?next=/tarifs"
                  className="w-full rounded-full border px-5 py-2 font-medium hover:bg-gray-50 text-center"
                >
                  Essayer
                </Link>
              )
            }
          />
        </div>
      </section>

      {/* ====== Bloc 2: Pour agences & pros ====== */}
      <section className="mt-12">
        <h2 className="text-sm font-semibold text-gray-900">Pour agences & pros</h2>
        <p className="text-sm text-gray-600">
          Pensé pour les équipes, avec des volumes et des besoins avancés.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Business 79 € */}
          <PlanCard
            title="Business"
            price="79 €"
            sub="/mois"
            features={[
              "Biens illimités",
              "Multi-collaborateurs",
              "Exports comptables",
              "Flux annonces (coming soon)",
              "Support dédié",
            ]}
            cta={
              session ? (
                priceButton(PRICE.business, "Commencer")
              ) : (
                <Link
                  href="/auth/login?next=/tarifs"
                  className="w-full rounded-full bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-500 text-center"
                >
                  Commencer
                </Link>
              )
            }
          />

          {/* Enterprise – Sur devis */}
          <PlanCard
            title="Enterprise"
            price="Sur devis"
            features={[
              "Marque blanche",
              "Intégrations & API",
              "SLA & onboarding",
              "IA avancée & automatisations",
            ]}
            cta={
              <Link
                href="/contact"
                className="w-full rounded-full border px-5 py-2 font-medium hover:bg-gray-50 text-center"
              >
                Essayer
              </Link>
            }
          />
        </div>
      </section>
    </main>
  );
}

/* ---------- Composants ---------- */

function PlanCard({
  title,
  price,
  sub,
  features,
  cta,
  badge,
  highlighted,
}: {
  title: string;
  price: string;
  sub?: string;
  features: string[];
  cta: React.ReactNode;
  badge?: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border bg-white p-6",
        highlighted ? "ring-1 ring-indigo-200" : "shadow-sm",
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {badge && (
          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-2">
        <div className="text-3xl font-extrabold">{price}</div>
        {sub && <div className="text-sm text-gray-500">{sub}</div>}
      </div>

      <ul className="mt-4 space-y-2 text-sm text-gray-700">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L8.5 11.086l6.543-6.543a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-6">{cta}</div>
    </div>
  );
}

/** Génère un bouton Stripe si un priceId est présent, sinon renvoie vers l’abonnement */
function priceButton(priceId: string | undefined, label: string) {
  if (!priceId) {
    return (
      <Link
        href="/compte/abonnement"
        className="w-full rounded-full bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-500 text-center"
      >
        {label}
      </Link>
    );
  }
  // Si tu as déjà un composant StripePostButton, tu peux l'utiliser ici :
  return (
    <form action="/api/billing/checkout" method="POST" className="w-full">
      <input type="hidden" name="priceId" value={priceId} />
      <input type="hidden" name="mode" value="subscription" />
      <button
        type="submit"
        className="w-full rounded-full bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-500"
      >
        {label}
      </button>
    </form>
  );
}
