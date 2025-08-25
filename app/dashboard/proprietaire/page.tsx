import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";

export default async function ProprietaireDashboard() {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-4 sm:px-6 pt-24">
        <h1 className="text-2xl font-bold">Tableau de bord propriétaire</h1>
        <p className="mt-4 text-gray-600">
          Vous n’êtes pas connecté.{" "}
          <a
            className="text-indigo-600 underline"
            href={`/connexion?next=${encodeURIComponent("/dashboard/proprietaire")}`}
          >
            Se connecter
          </a>
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-24">
      <h1 className="text-2xl font-bold">Bienvenue {user.email}</h1>
      <p className="mt-2 text-gray-600">Gérez vos annonces, vos demandes et votre abonnement.</p>
    </main>
  );
}
