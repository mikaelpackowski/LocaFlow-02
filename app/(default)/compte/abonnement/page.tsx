import BillingButtons from "@/components/billing/BillingButtons";
import { auth } from "@/auth";
import { getSubscriptionStatusByEmail } from "@/lib/subscription";

export const metadata = { title: "Mon abonnement | ForGesty" };

export default async function AbonnementPage() {
  const session = await auth();
  if (!session?.user?.email) {
    return (
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <p>Veuillez <a className="text-violet-600 underline" href="/auth/login">vous connecter</a>.</p>
      </main>
    );
  }

  const sub = await getSubscriptionStatusByEmail(session.user.email);

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="text-2xl font-bold">Mon abonnement</h1>
      <p className="mt-2 text-gray-600">
        Statut : <strong>{sub.active ? "actif" : "aucun abonnement"}</strong>
        {sub.priceId ? ` — ${sub.priceId}` : ""}
      </p>

      <div className="mt-6">
        {sub.active ? (
          <BillingButtons hasSubscription />
        ) : (
          <p className="text-gray-600">
            Vous n’avez pas encore d’abonnement actif. Rendez-vous sur la page <a className="text-violet-600 underline" href="/tarifs">Tarifs</a>.
          </p>
        )}
      </div>
    </main>
  );
}
