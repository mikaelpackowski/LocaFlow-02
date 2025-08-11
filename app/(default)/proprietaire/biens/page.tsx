import Link from "next/link";
import { mockProperties } from "@/utils/owner-data";

export const metadata = { title: "Mes biens | LocaFlow" };

export default function BiensPage() {
  const properties = mockProperties();

  return (
    <main>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mes biens</h1>
          <p className="text-gray-600">Gérez vos annonces et leur statut.</p>
        </div>
        <Link
          href="/proprietaire/biens/nouveau"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          + Nouveau bien
        </Link>
      </header>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50 text-left text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Titre</th>
              <th className="px-4 py-3">Ville</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Loyer</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-white text-sm">
            {properties.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-gray-900">{p.title}</td>
                <td className="px-4 py-3">{p.city}</td>
                <td className="px-4 py-3 capitalize">{p.type}</td>
                <td className="px-4 py-3">{p.rent.toLocaleString("fr-FR")} €</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <Link href={`/annonces/${p.slug}`} className="text-indigo-600 hover:underline">Voir</Link>
                    <button className="text-gray-600 hover:underline" disabled>Modifier</button>
                    <button className="text-rose-600 hover:underline" disabled>Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
