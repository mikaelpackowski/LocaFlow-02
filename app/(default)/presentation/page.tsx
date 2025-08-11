export default function PresentationPage() {
  return (
    <section className="relative overflow-hidden pt-24 md:pt-32 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Titre */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
            Découvrez LocaFlow
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            La plateforme qui simplifie et automatise la gestion locative pour
            les propriétaires, locataires et agences.
          </p>
        </div>

        {/* Section 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <img
            src="/images/dashboard-illustration.jpg"
            alt="Aperçu du tableau de bord"
            className="rounded-xl shadow-lg"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Tout en un seul endroit
            </h2>
            <p className="text-gray-600 mb-4">
              LocaFlow centralise toutes vos démarches : annonces, contrats,
              paiements, suivi des locataires… Vous gagnez du temps et réduisez
              vos tâches administratives.
            </p>
            <ul className="list-disc list-inside text-gray-600">
              <li>Publiez vos annonces en quelques clics</li>
              <li>Gérez vos contrats et documents</li>
              <li>Suivez les paiements en temps réel</li>
            </ul>
          </div>
        </div>

        {/* Section 2 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Automatisation intelligente
            </h2>
            <p className="text-gray-600 mb-4">
              LocaFlow envoie automatiquement les rappels, les courriers et
              notifications importantes à vos locataires.
            </p>
            <ul className="list-disc list-inside text-gray-600">
              <li>Rappels automatiques de paiement</li>
              <li>Envoi de documents légaux</li>
              <li>Notifications personnalisées</li>
            </ul>
          </div>
          <img
            src="/images/automation-illustration.jpg"
            alt="Automatisation intelligente"
            className="rounded-xl shadow-lg"
          />
        </div>

        {/* CTA final */}
        <div className="text-center mt-20">
          <a
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-full bg-violet-500 px-8 py-4 text-white font-semibold shadow-lg transition hover:bg-violet-600 hover:-translate-y-0.5 active:translate-y-0"
          >
            Commencer maintenant
          </a>
        </div>
      </div>
    </section>
  );
}
