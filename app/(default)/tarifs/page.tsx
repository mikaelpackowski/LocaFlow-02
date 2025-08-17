import StickyOffset from "@/components/StickyOffset";
import PricingCard from "@/components/PricingCard";
import { registerLink } from "@/lib/register-link";
import { PRICE } from "@/lib/prices";

export const metadata = {
  title: "Tarifs – ForGesty",
};

export default function TarifsPage() {
  return (
    <StickyOffset targetId="site-header">
      <main className="mx-auto max-w-6xl px-4 py-16">
        {/* Titre + sous-titre */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Tarifs <span className="text-violet-600">ForGesty</span>
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Des plans clairs pour propriétaires et agences.  
            Commencez gratuitement, évoluez quand vous le souhaitez.
          </p>
        </div>

        {/* Section Propriétaires */}
        <section className="mb-16">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Pour propriétaires
          </h2>
          <p className="mb-8 text-gray-600">
            Idéal pour gérer quelques biens simplement et efficacement.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
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
            <PricingCard
              title="Propriétaire"
              price="14 €"
              badge="Populaire"
              features={[
                "Jusqu’à 5 biens",
                "Quittances automatiques",
                "Paiement en ligne",
                "Aide IA intégrée",
                "Support standard",
              ]}
              cta={registerLink(PRICE.owner, "Choisir")}
            />
            <PricingCard
              title="Premium"
              price="29 €"
              features={[
                "Jusqu’à 15 biens",
                "Relances & rappels automatiques",
                "Gestion artisans & interventions",
                "Documents illimités",
                "Support prioritaire",
              ]}
              cta={registerLink(PRICE.premium, "Choisir")}
            />
          </div>
        </section>

        {/* Section Agences & pros */}
        <section>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Pour agences & pros
          </h2>
          <p className="mb-8 text-gray-600">
            Pensé pour les équipes, avec des volumes et des besoins avancés.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <PricingCard
              title="Business"
              price="79 €"
              features={[
                "Biens illimités",
                "Multi-collaborateurs",
                "Exports comptables",
                "Flux annonces (coming soon)",
                "Support dédié",
              ]}
              cta={registerLink(PRICE.business, "Choisir")}
            />
            <PricingCard
              title="Entreprise"
              price="Sur devis"
              features={[
                "Marque blanche",
                "Intégrations & API",
                "SLA & onboarding",
                "IA avancée & automatisations",
              ]}
              cta={registerLink(PRICE.enterprise, "Choisir")}
            />
          </div>
        </section>
      </main>
    </StickyOffset>
  );
}
