// app/(default)/compte/abonnement/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import Link from "next/link";
import StripePostButton from "@/components/billing/StripePostButton";

export const metadata = {
  title: "Mon abonnement | ForGesty",
  description: "Gérez votre abonnement ForGesty.",
};

export default async function AbonnementPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900">Mon abonnement</h1>
        <p className="mt-2 text-gray-600">
          Vous devez être connecté pour accéder à cette page.
        </p>
        <div className="mt-4">
          <Link
            href="/auth/login"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500"
          >
            Se connecter
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Mon abonnement</h1>
      <p className="mt-2 text-gray-600">
        Gérez votre abonnement ou passez au plan Pro.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {/* Ouvrir le portail Stripe pour gérer l’abonnement */}
        <StripePostButton
          endpoint="/api/billing/portal"
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          label="Gérer mon abonnement"
        />

        {/* Lancer un Checkout (remplace 'price_123' par ton Price ID Stripe) */}
        <StripePostButton
          endpoint="/api/billing/checkout"
          payload={{ priceId: "price_123", mode: "subscription" }}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          label="Souscrire Pro"
        />
      </div>
    </main>
  );
}
