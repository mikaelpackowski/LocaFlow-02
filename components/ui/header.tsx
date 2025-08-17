// app/(default)/profil/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Mon profil – ForGesty",
  description: "Consultez et gérez les informations de votre compte.",
};

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);

  // Si pas connecté → redirige vers login avec callback
  if (!session?.user?.email) {
    redirect(`/auth/login?callbackUrl=${encodeURIComponent("/profil")}`);
  }

  // À partir d’ici, session et user sont définis
  const user = session.user!;
  const role = (user as any).role ?? "Utilisateur";

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 pt-28 pb-16 space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mon profil</h1>
        <p className="mt-1 text-gray-600">Gérez vos informations personnelles.</p>
      </header>

      <section className="rounded-2xl border bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Informations</h2>
            <p className="mt-1 text-sm text-gray-600">
              Ces informations proviennent de votre compte.
            </p>
          </div>
          {/* Badge rôle */}
          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {role}
          </span>
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <dt className="text-xs uppercase tracking-wide text-gray-500">Nom</dt>
            <dd className="mt-1 font-medium text-gray-900">
              {user.name ?? "—"}
            </dd>
          </div>

          <div className="rounded-lg border p-4">
            <dt className="text-xs uppercase tracking-wide text-gray-500">Email</dt>
            <dd className="mt-1 font-medium text-gray-900">
              {user.email}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-3">
          {/* Dashboard propriétaire */}
          <Link
            href="/proprietaire/dashboard"
            className="inline-flex items-center rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-500"
          >
            Tableau de bord
          </Link>

          <Link
            href="/compte/abonnement"
            className="inline-flex items-center rounded-full border px-5 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Abonnement & factures
          </Link>

          <Link
            href="/auth/change-password"
            className="inline-flex items-center rounded-full border px-5 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Changer mon mot de passe
          </Link>
        </div>
      </section>
    </main>
  );
}
