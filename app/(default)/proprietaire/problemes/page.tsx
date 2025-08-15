// app/(default)/proprietaire/problemes/page.tsx

export const metadata = {
  title: "Gérer un problème | LocaFlow",
  description: "Déclarer/traiter un incident côté propriétaire.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Gérer un problème</h1>
      <p className="mt-1 text-gray-600">
        Créez un ticket, ajoutez des détails et assignez-le à un artisan si besoin.
      </p>

      <form
        method="post"
        action="/api/tickets"
        encType="multipart/form-data"
        className="mt-8 space-y-5"
      >
        {/* Marqueur côté propriétaire */}
        <input type="hidden" name="role" value="owner" />

        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-gray-800">
            Titre du problème
          </label>
          <input
            name="title"
            required
            minLength={3}
            maxLength={120}
            placeholder="Ex. : Panne chauffe-eau – Appartement A12"
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-800">
            Description
          </label>
          <textarea
            name="description"
            required
            minLength={10}
            maxLength={5000}
            rows={5}
            placeholder="Précisez le contexte, depuis quand, interventions déjà réalisées, etc."
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>

        {/* Urgence */}
        <div>
          <label className="block text-sm font-medium text-gray-800">
            Urgence
          </label>
          <select
            name="urgency"
            defaultValue="moyenne"
            className="mt-1 w-full rounded-lg border px-3 py-2"
          >
            <option value="faible">Faible</option>
            <option value="moyenne">Moyenne</option>
            <option value="haute">Haute</option>
          </select>
        </div>

        {/* Bien concerné (si vous avez un ID de bien côté propriétaire) */}
        <div>
          <label className="block text-sm font-medium text-gray-800">
            Bien concerné (ID ou référence interne)
          </label>
          <input
            name="propertyId"
            placeholder="Ex. : BIEN_12345"
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
          <p className="mt-1 text-xs text-gray-500">
            Optionnel — utile pour rattacher automatiquement le ticket au bon lot.
          </p>
        </div>

        {/* Affectation / Artisan */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-800">
              Assigner à (email artisan)
            </label>
            <input
              type="email"
              name="assignTo"
              placeholder="artisan@exemple.com"
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
            <p className="mt-1 text-xs text-gray-500">
              Optionnel — laisse vide si vous n&apos;assignez pas encore.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800">
              Statut
            </label>
            <select
              name="status"
              defaultValue="nouveau"
              className="mt-1 w-full rounded-lg border px-3 py-2"
            >
              <option value="nouveau">Nouveau</option>
              <option value="en_cours">En cours</option>
              <option value="resolu">Résolu</option>
            </select>
          </div>
        </div>

        {/* Coordonnées */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-800">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="vous@exemple.com"
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800">
              Téléphone (optionnel)
            </label>
            <input
              type="tel"
              name="phone"
              pattern="[+0-9() .-]{6,20}"
              placeholder="+33 6 12 34 56 78"
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
        </div>

        {/* Pièces jointes */}
        <div>
          <label className="block text-sm font-medium text-gray-800">
            Photos (JPG/PNG/WEBP, 5 max, 5 Mo max / fichier)
          </label>
          <input
            type="file"
            name="images"
            multiple
            accept=".jpg,.jpeg,.png,.webp"
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
          <p className="mt-1 text-xs text-gray-500">
            Formats autorisés : JPG, PNG, WEBP. Maximum 5 fichiers, 5 Mo chacun.
          </p>
        </div>

        {/* Bouton */}
        <div className="pt-2">
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500"
          >
            Créer le ticket
          </button>
        </div>
      </form>
    </main>
  );
}
