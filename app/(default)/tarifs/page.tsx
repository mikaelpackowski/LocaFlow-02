// app/(default)/tarifs/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import StripePostButton from "@/components/billing/StripePostButton";
import Link from "next/link";

export const metadata = {
  title: "Tarifs | ForGesty",
  description: "Choisissez le plan qui vous convient et gérez vos locations facilement.",
};

export default async function TarifsPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      <header className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Tarifs simples et transparents
        </h1>
        <p className="mt-3 text-gray-600">
          Démarrez gratuitement, passez au plan Pro quand vous avez besoin de plus.
        </p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Gratuit */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Gratuit</h2>
          <p className="mt-1 text-gray-600">Pour démarrer sereinement.</p>
          <div className="mt-4 text-3xl font-extrabold">0 €<span className="text-base font-medium text-gray-500">/mois</span></div>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            <li>• Annonces limitées</li>
            <li>• Dossier locatif de base</li>
            <li>• Messagerie simple</li>
          </ul>
          <div className="mt-6">
            {session ? (
              <Link
                href="/compte/abonnement"
                className="inline-flex items-center rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
              >
                Gérer mon compte
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
              >
                Créer un compte gratuit
              </Link>
            )}
          </div>
        </div>

        {/* Pro */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-indigo-100">
          <h2 className="text-xl font-semibold text-gray-900">Pro</h2>
          <p className="mt-1 text-gray-600">Automatisations et support prioritaire.</p>
          <div className="mt-4 text-3xl font-extrabold">19 €<span className="text-base font-medium text-gray-500">/mois</span></div>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            <li>• Annonces illimitées</li>
            <li>• Automatisations (quittances, relances)</li>
            <li>• Multilocataires / multi-biens</li>
            <li>• Support prioritaire</li>
          </ul>
          <div className="mt-6 flex gap-2">
            {session ? (
              <>
                <StripePostButton
                  endpoint="/api/billing/checkout"
                  // ⚠️ Mets ici TON priceId Stripe (ex: price_abc123)
                  payload={{ priceId: "price_123", mode: "subscription" }}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                  label="Passer au Pro"
                />
                <StripePostButton
                  endpoint="/api/billing/portal"
                  className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                  label="Gérer l’abonnement"
                />
              </>
            ) : (
              <Link
                href="/auth/login?next=/tarifs"
                className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Se connecter pour souscrire
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
