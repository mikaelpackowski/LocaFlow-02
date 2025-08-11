export const metadata = { title: "Nouveau bien | LocaFlow" };

export default function NouveauBienPage() {
  return (
    <main className="max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Déposer un bien</h1>
      <p className="mt-1 text-gray-600">Formulaire de démonstration (non connecté).</p>

      <form className="mt-6 space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Titre</label>
          <input className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="Ex. T2 Lyon - Part-Dieu" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ville</label>
            <input className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="Lyon 3" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Loyer (€)</label>
            <input type="number" className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="900" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select className="mt-1 w-full rounded-lg border px-3 py-2">
            <option>appartement</option>
            <option>studio</option>
            <option>maison</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea className="mt-1 w-full rounded-lg border px-3 py-2" rows={4} placeholder="Description..."></textarea>
        </div>
        <div className="flex gap-3">
          <button type="button" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500" disabled>
            Enregistrer (démo)
          </button>
          <a href="/proprietaire/biens" className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
            Annuler
          </a>
        </div>
      </form>
    </main>
  );
}
