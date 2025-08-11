import { mockOwnerStats, mockProperties, mockApplications, mockPayments } from "@/utils/owner-data";
import Link from "next/link";

export const metadata = {
  title: "Tableau de bord propriétaire | LocaFlow",
};

export default function DashboardPage() {
  const stats = mockOwnerStats();
  const properties = mockProperties().slice(0, 5);
  const applications = mockApplications().slice(0, 5);
  const payments = mockPayments().slice(0, 5);

  return (
    <main className="space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="mt-1 text-gray-600">Vue d’ensemble de votre activité locative.</p>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Biens en ligne" value={stats.listed} />
        <StatCard title="Occup. moyenne" value={`${stats.occupancy}%`} />
        <StatCard title="Loyers du mois" value={`${stats.rentThisMonth.toLocaleString("fr-FR")} €`} />
        <StatCard title="Candidatures" value={stats.applications} />
      </section>

      {/* 2 colonnes */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Mes biens (5 derniers)" action={<Link href="/proprietaire/biens" className="text-sm text-indigo-600 hover:underline">Voir tous</Link>}>
            <div className="divide-y">
              {properties.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-gray-900">{p.title}</div>
                    <div className="text-sm text-gray-500">{p.city} • {p.type} • {p.rent.toLocaleString("fr-FR")} €</div>
                  </div>
                  <Link href={`/annonces/${p.slug}`} className="text-sm text-indigo-600 hover:underline">
                    Ouvrir
                  </Link>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Candidatures récentes" action={<Link href="/proprietaire/demandes" className="text-sm text-indigo-600 hover:underline">Voir toutes</Link>}>
            <div className="divide-y">
              {applications.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-gray-900">{a.applicant}</div>
                    <div className="text-sm text-gray-500">{a.propertyTitle} • {a.city}</div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    a.status === "Reçue" ? "bg-gray-100 text-gray-700" :
                    a.status === "En cours" ? "bg-amber-100 text-amber-700" :
                    "bg-emerald-100 text-emerald-700"
                  }`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Paiements récents" action={<Link href="/proprietaire/paiements" className="text-sm text-indigo-600 hover:underline">Voir tout</Link>}>
            <div className="divide-y">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-gray-900">{p.tenant}</div>
                    <div className="text-sm text-gray-500">{p.propertyTitle} • {p.date}</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">{p.amount.toLocaleString("fr-FR")} €</div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Actions rapides">
            <div className="flex flex-col gap-2">
              <Link href="/proprietaire/biens/nouveau" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
                + Déposer un bien
              </Link>
              <Link href="/proprietaire/documents" className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
                Générer une quittance
              </Link>
              <Link href="/proprietaire/demandes" className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
                Voir les candidatures
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

function Card({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-5 py-3">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
