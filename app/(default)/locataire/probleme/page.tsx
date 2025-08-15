// app/(default)/locataire/probleme/page.tsx

export const metadata = {
  title: "Signaler un problème | LocaFlow",
  description: "Déclarer un incident dans le logement.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Signaler un problème</h1>
      <p className="mt-1 text-gray-600">
        Décrivez le souci rencontré dans votre logement et, si possible, ajoutez des photos.
      </p>

      {/* Formulaire compatible avec /api/tickets (Zod côté API) */}
      <form
        method="post"
        action="/api/tickets"
        encType="multipart/form-data"
        className="mt-8 space-y-5"
      >
        {/* Rôle fixé côté locataire */}
        <input type="hidden" name="role" value="tenant" />

        <div>
          <label className="block text-sm font-medium text-gray-800">
            Titre du problème
          </label>
          <input
            name="title"
            required
            minLength={3}
            maxLength={120}
            placeholder="Ex. : Fuite sous l’évier de la cuisine"
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>

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
            placeholder="Décrivez précisément le problème, depuis quand, où exactement, etc."
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>

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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-800">
              Email
            </label>
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
              // pattern cohérent avec l’API (cf. Zod refine)
              pattern="[+0-9() .-]{6,20}"
              placeholder="+33 6 12 34 56 78"
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </div>
        </div>

        {/* Si tu as un identifiant de logement lié au compte locataire, tu peux l’injecter ici */}
        {/* <input type="hidden" name="propertyId" value="mon_bien_123" /> */}

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

        <div className="pt-2">
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500"
          >
            Envoyer
          </button>
        </div>
      </form>
    </main>
  );
}
