import { mockPayments } from "@/utils/owner-data";

export const metadata = { title: "Paiements | LocaFlow" };

export default function PaiementsPage() {
  const items = mockPayments();
  const total = items.reduce((sum, p) => sum + p.amount, 0);

  return (
    <main>
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Paiements</h1>
          <p className="text-gray-600">Suivi des loyers et règlements récents.</p>
        </div>
        <div className="rounded-lg border bg-white px-4 py-2 text-sm shadow-sm">
          Total affiché : <span className="font-semibold">{total.toLocaleString("fr-FR")} €</span>
        </div>
      </header>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50 text-left text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Locataire</th>
              <th className="px-4 py-3">Bien</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Montant</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white text-sm">
            {items.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-gray-900">{p.tenant}</td>
                <td className="px-4 py-3">{p.propertyTitle}</td>
                <td className="px-4 py-3">{p.date}</td>
                <td className="px-4 py-3">{p.amount.toLocaleString("fr-FR")} €</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-indigo-600 hover:underline" disabled>Reçu PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
