// app/(default)/compte/abonnement/page.tsx
import SuccessNotice from "@/components/SuccessNotice";

export const metadata = {
  title: "Mon abonnement – ForGesty",
  description: "Gérez votre abonnement et vos paiements.",
};

export default function AbonnementPage({
  searchParams,
}: {
  searchParams?: { success?: string };
}) {
  const justPaid = searchParams?.success === "true";

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Mon abonnement</h1>

      {/* Affiche la notice si l’utilisateur revient du paiement */}
      {justPaid && <SuccessNotice />}

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          État de l’abonnement
        </h2>
        <p className="text-gray-700">
          Ici vous pourrez voir l’état de votre abonnement, gérer vos factures
          et accéder au portail Stripe.
        </p>

        <div className="mt-6">
          <a
            href="/api/billing/portal"
            className="inline-flex rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-500"
          >
            Gérer mon abonnement
          </a>
        </div>
      </section>
    </main>
  );
}
