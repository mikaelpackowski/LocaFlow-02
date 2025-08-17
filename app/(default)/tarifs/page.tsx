// app/(default)/tarifs/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import Link from "next/link";

export const metadata = {
  title: "Tarifs – ForGesty",
  description:
    "Des plans clairs pour propriétaires et agences. Commencez gratuitement, évoluez quand vous le souhaitez.",
};

export default async function TarifsPage() {
  // on ne s’en sert plus pour le routing, mais on garde si besoin plus tard
  await getServerSession(authOptions);

  return (
    // ↑ pt-24/28 pour ne plus être masqué par le header fixe
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-24 md:pt-28 pb-16">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Tarifs{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            ForGesty
          </span>
        </h1>
        <p className="mt-3 text-gray-600">
          Des plans clairs pour propriétaires et agences. Commencez gratuitement,
          évoluez quand vous le souhaitez.
        </p>
      </header>

      {/* ====== Pour propriétaires ====== */}
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
            cta={registerLink(undefined, "Choisir")}
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
            cta={registerLink("proprietaire", "Choisir")}
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
            cta={registerLink("premium", "Choisir")}
          />
        </div>
      </section>

      {/* ====== Agences & pros ====== */}
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
            cta={registerLink("business", "Choisir")}
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
                Choisir
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
        // ↓ flex col + h-full pour aligner les boutons
        "flex h-full flex-col rounded-2xl border bg-white p-6",
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

      {/* flex-1 pour pousser le CTA en bas */}
