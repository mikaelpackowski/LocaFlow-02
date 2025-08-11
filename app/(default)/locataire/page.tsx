export const metadata = {
  title: "Locataire – LocaFlow",
  description: "Recherchez, candidatez et suivez vos démarches locatives.",
};

export default function LocatairePage() {
  return (
    <section className="pt-28 md:pt-36">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Services pour <span className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">locataires</span>
          </h1>
          <p className="mt-4 text-gray-600">
            Constituez votre dossier, planifiez vos visites, signez en ligne et suivez vos paiements.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-xl border p-6">
            <h3 className="font-semibold mb-2">Dossier numérique</h3>
            <p className="text-gray-600">CV locatif, pièces jointes, partage sécurisé avec le bailleur.</p>
          </div>
          <div className="rounded-xl border p-6">
            <h3 className="font-semibold mb-2">Visites & candidatures</h3>
            <p className="text-gray-600">Prise de RDV en ligne, suivi en temps réel.</p>
          </div>
          <div className="rounded-xl border p-6">
            <h3 className="font-semibold mb-2">Paiements</h3>
            <p className="text-gray-600">Historique, reçus, rappels automatiques.</p>
          </div>
        </div>

        <div className="text-center mt-12">
          <a href="/auth/login?role=tenant" className="inline-flex rounded-full bg-violet-500 px-7 py-3 text-white font-semibold hover:bg-violet-600 transition">
            Créer un compte locataire
          </a>
        </div>
      </div>
    </section>
  );
}
