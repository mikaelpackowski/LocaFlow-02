import Link from "next/link";

export const metadata = {
  title: "Tarifs | ForGesty",
  description:
    "Plans simples pour propriétaires et agences. Choisissez l’offre qui vous convient et démarrez en quelques minutes.",
};

type Plan = {
  name: string;
  price: string;
  cycle?: string;
  badge?: string;
  features: string[];
  ctaHref: string;
  highlight?: boolean;
};

function PricingCard({
  plan,
  variant = "owner",
}: {
  plan: Plan;
  variant?: "owner" | "pro";
}) {
  return (
    <div
      className={`relative rounded-2xl border bg-white p-6 shadow-sm transition ${
        plan.highlight ? "border-violet-300 shadow-violet-100" : "border-gray-200"
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-3 left-6 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
          {plan.badge}
        </span>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-gray-900">{plan.price}</span>
          {plan.cycle && <span className="text-sm text-gray-500">{plan.cycle}</span>}
        </div>
      </div>

      <ul className="mt-4 space-y-2 text-sm text-gray-700">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <svg
              className={`mt-0.5 h-4 w-4 flex-none ${
                variant === "pro" ? "text-emerald-600" : "text-violet-600"
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414l2.293 2.293 6.543-6.543a1 1 0 0 1 1.414 0Z"
                clipRule="evenodd"
              />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Link
          href={plan.ctaHref}
          className={`inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition
            ${
              plan.highlight
                ? "bg-violet-600 text-white hover:bg-violet-500"
                : "border border-gray-300 text-gray-900 hover:bg-gray-50"
            }`}
        >
          {plan.highlight ? "Commencer" : "Essayer"}
        </Link>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const ownerPlans: Plan[] = [
    {
      name: "Gratuit",
      price: "0 €",
      cycle: "/mois",
      features: [
        "1 bien",
        "Quittances manuelles",
        "Documents de base",
        "Découverte de la plateforme",
      ],
      ctaHref: "/auth/login?plan=free&role=owner",
    },
    {
      name: "Propriétaire",
      price: "14 €",
      cycle: "/mois",
      badge: "Populaire",
      features: [
        "Jusqu’à 5 biens",
        "Quittances automatiques",
        "Paiement en ligne",
        "Aide IA intégrée",
        "Support standard",
      ],
      ctaHref: "/auth/login?plan=owner&role=owner",
      highlight: true,
    },
    {
      name: "Premium",
      price: "29 €",
      cycle: "/mois",
      features: [
        "Jusqu’à 15 biens",
        "Relances & rappels automatiques",
        "Gestion artisans & interventions",
        "Documents illimités",
        "Support prioritaire",
      ],
      ctaHref: "/auth/login?plan=premium&role=owner",
    },
  ];

  const proPlans: Plan[] = [
    {
      name: "Business",
      price: "79 €",
      cycle: "/mois",
      features: [
        "Biens illimités",
        "Multi-collaborateurs",
        "Exports comptables",
        "Flux annonces (coming soon)",
        "Support dédié",
      ],
      ctaHref: "/auth/login?plan=business&role=owner",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Sur devis",
      features: [
        "Marque blanche",
        "Intégrations & API",
        "SLA & onboarding",
        "IA avancée & automatisations",
      ],
      ctaHref: "/contact?topic=enterprise",
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      {/* En-tête */}
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
          Tarifs ForGesty
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          Des plans clairs pour propriétaires et agences. Commencez gratuitement,
          évoluez quand vous le souhaitez.
        </p>
      </header>

      {/* Section propriétaires */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900">Pour propriétaires</h2>
        <p className="mt-1 text-sm text-gray-600">
          Idéal pour gérer quelques biens simplement et efficacement.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ownerPlans.map((p) => (
            <PricingCard key={p.name} plan={p} variant="owner" />
          ))}
        </div>
      </section>

      {/* Section agences */}
      <section className="mt-14">
        <h2 className="text-lg font-semibold text-gray-900">Pour agences & pros</h2>
        <p className="mt-1 text-sm text-gray-600">
          Pensé pour les équipes, avec des volumes et des besoins avancés.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {proPlans.map((p) => (
            <PricingCard key={p.name} plan={p} variant="pro" />
          ))}
        </div>
      </section>

      {/* Bandeau rassurance */}
      <section className="mt-16">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-gray-600">
            Besoin d’un accompagnement pour choisir ?{" "}
            <a href="/contact" className="font-medium text-violet-600 hover:underline">
              Contactez-nous
            </a>
            .
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Pas de frais cachés. Annulation possible à tout moment.
          </p>
        </div>
      </section>
    </main>
  );
}
