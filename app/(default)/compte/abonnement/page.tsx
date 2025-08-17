import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import SuccessNotice from "@/components/SuccessNotice";

export const metadata = {
  title: "Mon abonnement – ForGesty",
  description: "Gérez votre abonnement et vos paiements ForGesty.",
};

type Props = {
  searchParams?: { success?: string };
};

export default async function AbonnementPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);

  // On affiche le message de succès si ?success=true est présent dans l’URL
  const justPaid = searchParams?.success === "true";

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 pt-28 pb-16">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        Mon abonnement
      </h1>

      {justPaid && (
        <div className="mb-8">
          <SuccessNotice />
        </div>
      )}

      {/* Bloc état de l’abonnement (exemple provisoire) */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <p className="text-gray-700">
          Bonjour <span className="font-semibold">{session?.user?.name ?? "Utilisateur"}</span>,
        </p>
        <p className="mt-2 text-gray-600">
          Ici s’affichera bientôt le détail de votre abonnement (état :{" "}
          <span className="italic">active, canceled, past_due…</span>).
        </p>
      </div>
    </main>
  );
}
