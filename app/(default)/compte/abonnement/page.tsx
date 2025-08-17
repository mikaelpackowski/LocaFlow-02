// app/(default)/compte/abonnement/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import SuccessNotice from "@/components/SuccessNotice";

export const metadata = {
  title: "Mon abonnement – ForGesty",
};

interface Props {
  searchParams?: { success?: string };
}

export default async function AbonnementPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  // 🔹 Ici tu pourras récupérer l’état réel de l’abonnement depuis ta DB (Supabase)
  // Par exemple : const sub = await db.subscriptions.findByUser(session.user.id)
  const abonnement = {
    status: "active", // mock pour l’instant : "active" | "canceled" | "past_due"
    plan: "Premium 29 € / mois",
    renewal: "15 septembre 2025",
  };

  const justPaid = searchParams?.success === "true";

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Mon abonnement</h1>

      {justPaid && (
        <div className="mb-6">
          <SuccessNotice />
        </div>
      )}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Détails</h2>
        <dl className="mt-4 space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <dt>Plan actuel</dt>
            <dd className="font-medium">{abonnement.plan}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Statut</dt>
            <dd
              className={`font-medium ${
                abonnement.status === "active"
                  ? "text-green-600"
                  : abonnement.status === "past_due"
                  ? "text-orange-600"
                  : "text-red-600"
              }`}
            >
              {abonnement.status}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Prochain renouvellement</dt>
            <dd>{abonnement.renewal}</dd>
          </div>
        </dl>

        <div className="mt-6 text-center">
          <a
            href="/api/billing/portal"
            className="inline-flex items-center rounded-full border px-5 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Gérer mon abonnement
          </a>
        </div>
      </div>
    </main>
  );
}
