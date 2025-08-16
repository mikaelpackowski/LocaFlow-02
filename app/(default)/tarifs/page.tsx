import BillingButtons from "@/components/billing/BillingButtons";
import { auth } from "@/auth";
import { getSubscriptionStatusByEmail } from "@/lib/subscription";

export const metadata = {
  title: "Tarifs | ForGesty",
  description: "Choisissez votre formule d’abonnement.",
};

export default async function PricingPage() {
  const session = await auth();
  const email = session?.user?.email ?? "";
  const sub = email ? await getSubscriptionStatusByEmail(email) : { active: false };

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <h1 className="text-center text-3xl font-extrabold">Tarifs</h1>
      <p className="mt-2 text-center text-gray-600">Passez à la vitesse supérieure.</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {/* Essentiel */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Essentiel</h2>
          <p className="mt-1 text-gray-600">Pour démarrer.</p>
          <p className="mt-4 text-3xl font-extrabold">9,90€<span className="text-base font-normal text-gray-500">/mois</span></p>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            <li>• 3 annonces actives</li>
            <li>• Gestion des locataires</li>
            <li>• Rappels & documents</li>
          </ul>
          <div className="mt-6">
            <BillingButtons
              priceId={process.env.STRIPE_PRICE_BASIC}
              hasSubscription={sub.active}
            />
          </div>
        </div>

        {/* Pro */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Pro</h2>
          <p className="mt-1 text-gray-600">Pour gérer à l’échelle.</p>
          <p className="mt-4 text-3xl font-extrabold">24,90€<span className="text-base font-normal text-gray-500">/mois</span></p>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            <li>• Annonces illimitées</li>
            <li>• Automatisations avancées</li>
            <li>• Support prioritaire</li>
          </ul>
          <div className="mt-6">
            <BillingButtons
              priceId={process.env.STRIPE_PRICE_PRO}
              hasSubscription={sub.active}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
