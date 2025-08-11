export const metadata = {
  title: "Inscription Propriétaire | LocaFlow",
  description:
    "Créez votre compte propriétaire pour publier vos biens et gérer votre location.",
};

export default function InscriptionProprietairePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900">
        Créer un compte propriétaire
      </h1>
      <p className="mt-2 text-gray-600">
        Renseignez vos informations pour commencer à publier vos annonces et
        gérer vos biens sur LocaFlow.
      </p>

      {/* Formulaire simple côté serveur (action à brancher plus tard) */}
      <form
        method="post"
        action="/api/proprietaires/inscription"
        className="mt-8 space-y-6 rounded-xl border bg-white p-6 shadow-sm"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              name="lastName"
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="Dupont"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <input
              name="firstName"
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="Marie"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="nom@exemple.com"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="Au moins 8 caractères"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ville principale
            </label>
            <input
              name="city"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="Paris"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Nombre de biens à gérer
            </label>
            <input
              type="number"
              name="units"
              min={0}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="ex: 2"
            />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <input id="tos" type="checkbox" name="tos" required />
          <label htmlFor="tos" className="text-sm text-gray-700">
            J’accepte les{" "}
            <a href="/conditions" className="text-indigo-600 underline">
              conditions d’utilisation
            </a>{" "}
            et la{" "}
            <a href="/confidentialite" className="text-indigo-600 underline">
              politique de confidentialité
            </a>
            .
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-500"
          >
            Créer mon compte
          </button>
          <a
            href="/proprietaire"
            className="rounded-lg border px-5 py-3 font-semibold hover:bg-gray-50"
          >
            Retour
          </a>
        </div>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        Déjà inscrit ?{" "}
        <a href="/auth/login?role=owner" className="text-indigo-600 underline">
          Se connecter
        </a>
      </p>
    </main>
  );
}
