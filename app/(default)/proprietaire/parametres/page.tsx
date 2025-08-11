export const metadata = { title: "Paramètres | LocaFlow" };

export default function ParametresPage() {
  return (
    <main className="max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Paramètres</h1>
      <p className="text-gray-600">Profil, notifications et préférences.</p>

      <form className="mt-6 space-y-5 rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom complet</label>
          <input className="mt-1 w-full rounded-lg border px-3 py-2" defaultValue="Jean Dupont" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" className="mt-1 w-full rounded-lg border px-3 py-2" defaultValue="jean.dupont@example.com" />
        </div>
        <div className="flex items-center gap-2">
          <input id="notif" type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
          <label htmlFor="notif" className="text-sm text-gray-700">Recevoir les notifications par email</label>
        </div>
        <div className="flex gap-3">
          <button type="button" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500" disabled>
            Enregistrer (démo)
          </button>
          <a href="/proprietaire/dashboard" className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
            Annuler
          </a>
        </div>
      </form>
    </main>
  );
}
