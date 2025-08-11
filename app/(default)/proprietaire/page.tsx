// app/(default)/proprietaire/page.tsx

export const metadata = {
  title: "Services pour propriétaires | LocaFlow",
  description:
    "Déposez vos biens, suivez vos paiements et automatisez vos démarches avec LocaFlow.",
};

export default function ProprietairePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      {/* Titre + sous-titre */}
      <header className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Services pour{" "}
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
    propriétaires
          </span>
        </h1>
        <p className="mt-3 text-gray-600 max-w-3xl mx-auto">
          Publiez vos annonces, gérez les candidatures, signez en ligne,
          suivez vos paiements et automatisez les relances.
        </p>
      </header>

      {/* Cartes */}
      <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          title="Dossier & annonce"
          text="Créez la fiche de votre bien avec photos, critères et documents."
        />
        <Card
          title="Visites & candidatures"
          text="Planifiez des visites, recevez des dossiers complets et comparez."
        />
        <Card
          title="Gestion locative"
          text="Contrats, e-signature, quittances, relances et suivi des paiements."
        />
        <Card
          title="Tableau de bord"
          text="Vue globale de vos biens, échéances et flux financiers."
        />
        <Card
          title="Documents"
          text="Centralisation et partage sécurisé de vos pièces."
        />
        <Card
          title="Support"
          text="Une équipe à l’écoute pour vous aider si besoin."
        />
      </section>

      {/* Bouton principal (violet uni, arrondi complet) */}
      <div className="mt-10 flex justify-center">
        <a
          href="/proprietaire/inscription"
          className="inline-flex items-center justify-center rounded-full
                     bg-violet-500 px-6 py-3 text-white font-semibold shadow
                     transition hover:bg-violet-600 focus:outline-none
                     focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          Créer un compte propriétaire
        </a>
      </div>
    </main>
  );
}

function Card({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{text}</p>
    </div>
  );
}
