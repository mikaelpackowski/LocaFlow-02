import Link from "next/link";
import PricingCard from "@/components/PricingCard";
// Si tu n’utilises plus NextAuth ici, on peut retirer getServerSession/authOptions

export const metadata = {
  title: "Tarifs – ForGesty",
  description:
    "Des plans clairs pour propriétaires et agences. Commencez gratuitement, évoluez quand vous le souhaitez.",
};

const ownerSignupLink = (plan: "STARTER" | "PRO" | "PREMIUM" | "BUSINESS") =>
  `/inscription?role=owner&plan=${plan}&trial=1m&returnTo=/dashboard/proprietaire`;

export default async function TarifsPage() {
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
            // Pas d’essai pour le gratuit
            cta={
              <Link
                href="/inscription?role=owner&plan=STARTER&returnTo=/dashboard/proprietaire"
                className="w-full rounded-full bg-indigo-600 px-5 py-2 text-white text-center block hover:bg-indigo-700"
              >
                Choisir
              </Link>
            }
          />

          {/* Propriétaire 14 € — essai 1 mois */}
          <PricingCard
            title="Propriétaire"
            price="14 € / mois"
            badge="Essai 1 mois"
            features={[
              "Jusqu'à 5 biens",
              "Quittances automatiques",
              "Paiement en ligne",
              "Aide IA intégrée",
              "Support standard",
            ]}
            footnote="Essai gratuit 1 mois, sans engagement."
            cta={
              <Link
                href={ownerSignupLink("PRO")}
                className="w-full rounded-full bg-indigo-600 px-5 py-2 text-white text-center block hover:bg-indigo-700"
              >
                Commencer l’essai
              </Link>
            }
          />

          {/* Premium 29 € — essai 1 mois */}
          <PricingCard
            title="Premium"
            price="29 € / mois"
            badge="Essai 1 mois"
            features={[
              "Jusqu'à 15 biens",
              "Relances & rappels automatiques",
              "Gestion artisans & interventions",
              "Documents illimités",
              "Support prioritaire",
            ]}
            footnote="Essai gratuit 1 mois, sans engagement."
            cta={
              <Link
                href={ownerSignupLink("PREMIUM")}
                className="w-full rounded-full bg-indigo-600 px-5 py-2 text-white text-center block hover:bg-indigo-700"
              >
                Commencer l’essai
              </Link>
            }
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
          {/* Business 79 € — essai 1 mois */}
          <PricingCard
            title="Business"
            price="79 € / mois"
            badge="Essai 1 mois"
            features={[
              "Biens illimités",
              "Multi-collaborateurs",
              "Exports comptables",
              "Flux annonces (coming soon)",
              "Support dédié",
            ]}
            footnote="Essai gratuit 1 mois, sans engagement."
            cta={
              <Link
                href={ownerSignupLink("BUSINESS")}
                className="w-full rounded-full bg-indigo-600 px-5 py-2 text-white text-center block hover:bg-indigo-700"
              >
                Commencer l’essai
              </Link>
            }
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
                Nous contacter
              </Link>
            }
          />
        </div>
      </section>
    </main>
  );
}
