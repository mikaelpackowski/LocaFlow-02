// components/SearchBar.tsx
// Server component (no "use client")

type Props = {
  defaultQuery?: string;
  defaultCity?: string;
  defaultMin?: string | number;
  defaultMax?: string | number;
  defaultType?: string;
  defaultSort?: string; // kept in sync via hidden input
  cities: string[];
  types: string[];
};

export default function SearchBar({
  defaultQuery = "",
  defaultCity = "",
  defaultMin = "",
  defaultMax = "",
  defaultType = "all",
  defaultSort = "",
  cities,
  types,
}: Props) {
  return (
    <form method="get" className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-5">
      {/* Mot-clé */}
      <input
        type="text"
        name="q"
        defaultValue={defaultQuery}
        placeholder="Mot-clé (ex: Paris, balcon...)"
        className="w-full rounded-lg border px-3 py-2"
      />

      {/* Ville */}
      <select
        name="city"
        defaultValue={defaultCity}
        className="w-full rounded-lg border px-3 py-2"
        aria-label="Ville"
      >
        <option value="">Toutes les villes</option>
        {cities.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Loyer min */}
      <input
        type="number"
        name="min"
        min={0}
        step={50}
        defaultValue={defaultMin}
        placeholder="Loyer min (€)"
        className="w-full rounded-lg border px-3 py-2"
      />

      {/* Loyer max */}
      <input
        type="number"
        name="max"
        min={0}
        step={50}
        defaultValue={defaultMax}
        placeholder="Loyer max (€)"
        className="w-full rounded-lg border px-3 py-2"
      />

      {/* Type de bien */}
      <select
        name="type"
        defaultValue={defaultType}
        className="w-full rounded-lg border px-3 py-2"
      >
        <option value="all">Tous les types</option>
        {types.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {/* Garder le tri actuel (géré ailleurs via AutoSubmitSelect) */}
      <input type="hidden" name="sort" defaultValue={defaultSort} />

      {/* Actions */}
      <div className="sm:col-span-5 mt-2 flex items-center gap-2">
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Rechercher
        </button>
        <a
          href="/annonces"
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Réinitialiser les filtres
        </a>
      </div>
    </form>
  );
}
