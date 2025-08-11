// app/(default)/locataire/dashboard/page.tsx
import TenantSidebar from "@/components/tenant/TenantSidebar";

export const metadata = {
  title: "Dashboard locataire | LocaFlow",
  description:
    "Votre espace locataire : dossier, visites, candidatures et paiements.",
};

export default function TenantDashboardPage() {
  // Données mock (à remplacer plus tard)
  const dossierCompletude = 72; // %
  const visites = [
    { id: "v1", date: "15/08/2025 18:00", bien: "T2 – Lyon 3ᵉ", statut: "Confirmée" },
    { id: "v2", date: "18/08/2025 14:30", bien: "Studio – Lille", statut: "En attente" },
  ];

  const paiements = [
    { id: "p1", mois: "Juillet 2025", montant: "540 €", statut: "Payé" },
    { id: "p2", mois: "Août 2025", montant: "540 €", statut: "À venir" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <TenantSidebar /> {/* ✅ pas de prop */}

        {/* Contenu */}
        <section className="space-y-6">
          {/* En-tête */}
          <header className="rounded-xl border bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">Bonjour 👋</h1>
            <p className="mt-1 text-gray-600">
              Retrouvez ici vos visites, candidatures et paiements. Complétez
              aussi votre dossier pour maximiser vos chances.
            </p>

            {/* Actions rapides */}
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="/locataire/dossier"
                className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
              >
                Ouvrir mon dossier
              </a>
              <a
                href="/annonces"
                className="rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-600"
              >
                Chercher un logement
              </a>
              <a
                href="/locataire/visites"
                className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
              >
                Mes visites
              </a>
            </div>
          </header>

          {/* Statut du dossier */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Dossier locatif</h2>
              <span className="text-sm text-gray-500">{dossierCompletude}% complété</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-violet-500 transition-all"
                style={{ width: `${dossierCompletude}%` }}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="/locataire/dossier"
                className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-black"
              >
                Compléter mon dossier
              </a>
              <a
                href="/locataire/documents"
                className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
              >
                Gérer mes documents
              </a>
            </div>
          </div>

          {/* Deux colonnes : visites / paiements */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Visites à venir */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Visites à venir</h2>
                <a href="/locataire/visites" className="text-sm text-violet-600 hover:underline">
                  Voir tout
                </a>
              </div>
              <ul className="mt-4 space-y-3">
                {visites.map((v) => (
                  <li key={v.id} className="rounded-lg border px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{v.bien}</p>
                        <p className="text-sm text-gray-500">{v.date}</p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          v.statut === "Confirmée"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {v.statut}
                      </span>
                    </div>
                  </li>
                ))}
                {visites.length === 0 && (
                  <p className="text-sm text-gray-500">Aucune visite prévue.</p>
                )}
              </ul>
            </div>

            {/* Paiements */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Paiements</h2>
                <a href="/locataire/paiements" className="text-sm text-violet-600 hover:underline">
                  Historique
                </a>
              </div>
              <ul className="mt-4 divide-y">
                {paiements.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900">{p.mois}</p>
                      <p className="text-sm text-gray-500">{p.montant}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        p.statut === "Payé"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {p.statut}
                    </span>
                  </li>
                ))}
                {paiements.length === 0 && (
                  <p className="text-sm text-gray-500">Aucun paiement pour le moment.</p>
                )}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
