export const metadata = { title: "Documents | LocaFlow" };

export default function DocumentsPage() {
  const docs = [
    { id: "d1", name: "Bail T2 Lyon.pdf", date: "01/07/2025", size: "312 Ko" },
    { id: "d2", name: "État des lieux - Entrée.pdf", date: "01/07/2025", size: "480 Ko" },
    { id: "d3", name: "Quittance - Juillet.pdf", date: "05/07/2025", size: "162 Ko" },
  ];

  return (
    <main>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Documents</h1>
      <p className="text-gray-600">Tous vos fichiers réunis et téléchargeables.</p>

      <div className="mt-6 rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-4 flex gap-3">
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500" disabled>
            Générer une quittance (démo)
          </button>
          <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50" disabled>
            Importer un document
          </button>
        </div>

        <ul className="divide-y">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-gray-900">{d.name}</div>
                <div className="text-sm text-gray-500">{d.date} • {d.size}</div>
              </div>
              <button className="text-indigo-600 hover:underline" disabled>Télécharger</button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
