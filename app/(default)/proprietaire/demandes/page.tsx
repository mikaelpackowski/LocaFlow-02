import { mockApplications } from "@/utils/owner-data";

export const metadata = { title: "Candidatures | LocaFlow" };

export default function DemandesPage() {
  const apps = mockApplications();

  return (
    <main>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Candidatures</h1>
      <p className="text-gray-600">Suivez les dossiers reçus, en cours, acceptés.</p>

      <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50 text-left text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Candidat</th>
              <th className="px-4 py-3">Bien</th>
              <th className="px-4 py-3">Ville</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white text-sm">
            {apps.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3 font-medium text-gray-900">{a.applicant}</td>
                <td className="px-4 py-3">{a.propertyTitle}</td>
                <td className="px-4 py-3">{a.city}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    a.status === "Reçue" ? "bg-gray-100 text-gray-700" :
                    a.status === "En cours" ? "bg-amber-100 text-amber-700" :
                    "bg-emerald-100 text-emerald-700"
                  }`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-indigo-600 hover:underline" disabled>Ouvrir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
