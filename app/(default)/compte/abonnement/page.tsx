// app/(default)/compte/abonnement/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import SuccessNotice from "@/components/SuccessNotice";
import Link from "next/link";

export const metadata = {
  title: "Mon abonnement – ForGesty",
  description: "Gérez votre abonnement et vos paiements ForGesty.",
};

export default async function AbonnementPage({
  searchParams,
}: {
  // ✅ ton projet attend un Promise pour searchParams
  searchParams?: Promise<{ success?: string }>;
}) {
  const sp = searchParams ? await searchParams : undefined;
  const justPaid = sp?.success === "true";

  // Récupère la session côté serveur
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user?.email;

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 pt-28 pb-16 space-y-8">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
        Mon abonnement
      </h1>

      {justPaid && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6 shadow-sm">
          <SuccessNotice />
        </div>
      )}

      {!isLoggedIn ? (
        // ---------- Carte quand l'utilisateur n'est pas connecté ----------
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Connexion requise</h2>
          <p className="mt-2 text-gray-600">
            Connectez-vous pour consulter votre abonnement et accéder au portail de facturation.
          </p>
          <div className="mt-6">
            <Link
              href={`/auth/login?callbackUrl=${encodeURIComponent("/compte/abonnement")}`}
              className="inline-flex items-center rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-500"
            >
              Se connecter
            </Link>
          </div>
        </section>
      ) : (
        // ---------- Carte quand l'utilisateur est connecté ----------
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">État de l’abonnement</h2>
              <p className="mt-1 text-sm text-gray-600">
                Consultez votre statut, vos factures et gérez votre moyen de paiement.
              </p>
            </div>
            {/* Badge statut (placeholder pour l’instant) */}
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              actif
            </span>
          </div>

          {/* TODO: remplace par tes vraies infos de DB si tu veux */}
          <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <dt className="text-xs uppercase tracking-wide text-gray-500">Plan</dt>
              <dd className="mt-1 font-medium text-gray-900">—</dd>
            </div>
            <div className="rounded-lg border p-4">
              <dt className="text-xs uppercase tracking-wide text-gray-500">Prochain renouvellement</dt>
              <dd className="mt-1 font-medium text-gray-900">—</dd>
            </div>
          </dl>

          {/* Lien vers le portail Stripe (protégé côté serveur) */}
          <div className="mt-6">
            <a
              href="/api/billing/portal"
              className="inline-flex items-center rounded-full border px-5 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Gérer mon abonnement
            </a>
          </div>
        </section>
      )}
    </main>
  );
}
