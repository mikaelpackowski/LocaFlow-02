// app/dashboard/proprietaire/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";

export default async function ProprietaireDashboard() {
  // 🔐 garde simple : exige une session
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) {
    // si pas connecté, renvoie vers inscription (on garde le retour prévu)
    redirect(`/inscription?role=owner&plan=PRO&trial=1m&returnTo=/dashboard/proprietaire`);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-24 md:pt-28 pb-14">
      <header className="mx-auto max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold">Tableau de bord propriétaire</h1>
        <p className="mt-2 text-gray-600">
          Bienvenue {user.email}! Gérez vos annonces, vos demandes et votre abonnement.
        </p>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <a
          href="/annonces/nouvelle"
          className="rounded-xl border p-4 hover:bg-gray-50 transition"
        >
          <h2 className="font-semibold">Déposer une annonce</h2>
          <p className="text-sm text-gray-600">Ajoutez un bien et publiez-le en quelques minutes.</p>
        </a>

        <a
          href="/annonces?owner=me"
          className="rounded-xl border p-4 hover:bg-gray-50 transition"
        >
          <h2 className="font-semibold">Mes annonces</h2>
          <p className="text-sm text-gray-600">Retrouvez et modifiez vos annonces existantes.</p>
        </a>
      </section>
    </main>
  );
}
