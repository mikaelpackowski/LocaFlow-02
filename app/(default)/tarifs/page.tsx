import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import PricingCard from "@/components/PricingCard";
import { registerLink } from "@/lib/register-link";
import { PRICE } from "@/lib/prices";
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
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-32 md:pt-36 pb-16">
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
          <PricingCard
            title="Gratuit"
            price="0 €"
            features={[
              "1 bien",
              "Quittances manuelles",
              "Documents de base",
              "Découverte de la plateforme",
            ]}
            cta={registerLink(PRICE.free, "Choisir")}
          />

          {/* Propriétaire 14 € */}
          <PricingCard
            title="Propriétaire"
            price="14 € / mois"
            badge="Populaire"
            features={[
              "Jusqu'à 5 biens",
              "Quittances automatiques",
              "Paiement en ligne",
              "Aide IA intégrée",
              "Support standard",
            ]}
            cta={registerLink(PRICE.owner, "Choisir")}
          />

          {/* Premium 29 € */}
          <PricingCard
            title="Premium"
            price="29 € / mois"
            features={[
              "Jusqu'à 15 biens",
              "Relances & rappels automatiques",
              "Gestion artisans & interventions",
              "Documents illimités",
              "Support prioritaire",
            ]}
            cta={registerLink(PRICE.premium, "Choisir")}
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
          <PricingCard
            title="Business"
            price="79 € / mois"
            features={[
              "Biens illimités",
              "Multi-collaborateurs",
              "Exports comptables",
              "Flux annonces (coming soon)",
              "Support dédié",
            ]}
            cta={registerLink(PRICE.business, "Choisir")}
          />

          {/* Enterprise – Sur devis */}
          <PricingCard
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
                className="w-full rounded-full border px-5 py-2 font-medium hover:bg-gray-50 text-center block"
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
