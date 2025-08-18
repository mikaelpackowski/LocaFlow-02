// app/(default)/annonces/page.tsx
import ListingCard from "@/components/ListingCard";
import SearchBar from "@/components/SearchBar";
import SortSelect from "@/components/SortSelect";

export const metadata = {
  title: "Annonces | LocaFlow",
  description: "Trouvez votre logement et filtrez selon vos critères.",
};

// Important pour forcer un rendu dynamique et éviter le cache côté Vercel
export const dynamic = "force-dynamic";

type SP = {
  q?: string;
  max?: string;
  type?: string;
  sort?: string;
  page?: string;
  limit?: string;
};

export default async function AnnoncesPage(props: any) {
  // ⬅️ pas de type sur le paramètre !
  const sp = (props?.searchParams ?? {}) as SP;

  const q = (sp.q || "").trim();
  const max = (sp.max || "").trim();
  const type = (sp.type || "").trim();
  const sort = (sp.sort || "").trim();
  const page = Number(sp.page ?? 1);
  const limit = Number(sp.limit ?? 12);


  // Construire la query POUR L’API uniquement avec les champs renseignés
  const qs = new URLSearchParams();
  if (q) qs.set("q", q);
  if (max) qs.set("max", max);
  if (type && type !== "all") qs.set("type", type);
  if (sort) qs.set("sort", sort);
  qs.set("page", String(page));
  qs.set("limit", String(limit));

  // Fetch relatif (OK côté serveur Next 15)
  let data: any = { items: [], total: 0, page: 1, pages: 1, limit };
  try {
    const res = await fetch(`/api/annonces${qs.toString() ? `?${qs}` : ""}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`API status ${res.status}`);
    data = await res.json();
  } catch (e) {
    console.error("Erreur fetch /api/annonces:", e);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      <h1 className="text-3xl font-bold text-gray-900 text-center">Annonces</h1>
      <p className="mt-2 text-center text-gray-500">
        Explorez les biens disponibles et filtrez selon vos critères.
      </p>

      {/* Barre de recherche (garde tes props actuelles si besoin) */}
      <SearchBar
        defaultQuery={q}
        defaultMax={max}
        defaultType={type || "all"}
        defaultSort={sort}
        cities={[]}   // si tu en as, passe-les ici
        types={[]}    // idem
      />

      {/* Tri (soumet juste sort=... en GET) */}
      <div className="mt-4 flex justify-end">
        <form method="get" className="flex items-center gap-2">
          <input type="hidden" name="q" defaultValue={q} />
          <input type="hidden" name="max" defaultValue={max} />
          <input type="hidden" name="type" defaultValue={type || "all"} />
          <SortSelect defaultValue={sort} />
        </form>
      </div>

      {data.items.length === 0 ? (
        <p className="mt-10 text-center text-gray-500">
          Aucune annonce ne correspond à vos critères.
        </p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((l: any) => (
              <ListingCard
                key={l.id}
                id={l.id}
                title={l.title}
                city={l.city}
                type={l.type}
                rent={l.rent}
                charges={l.charges}
                bedrooms={l.bedrooms}
                surface={l.surface}
                furnished={l.furnished}
                image={l.image ?? null} // API renvoie image: string|null
              />
            ))}
          </div>

          <Pagination
            total={data.total}
            page={data.page}
            pages={data.pages}
            limit={data.limit}
            searchParams={{ q, max, type, sort }}
          />
        </>
      )}
    </main>
  );
}

function Pagination({
  total,
  page,
  pages,
  limit,
  searchParams,
}: {
  total: number;
  page: number;
  pages: number;
  limit: number;
  searchParams: Record<string, string>;
}) {
  if (pages <= 1) return null;

  const makeLink = (p: number) => {
    const sp = new URLSearchParams(searchParams);
    if (!sp.get("q")) sp.delete("q");
    if (!sp.get("max")) sp.delete("max");
    if (!sp.get("type") || sp.get("type") === "all") sp.delete("type");
    if (!sp.get("sort")) sp.delete("sort");
    sp.set("page", String(p));
    sp.set("limit", String(limit));
    return `/annonces?${sp.toString()}`;
  };

  const first = Math.max(1, page - 2);
  const last = Math.min(pages, first + 4);
  const pagesToShow = Array.from({ length: last - first + 1 }, (_, i) => first + i);

  return (
    <nav className="mt-10 flex items-center justify-center gap-2">
      <a
        href={makeLink(Math.max(1, page - 1))}
        className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
      >
        ← Précédent
      </a>
      {pagesToShow.map((p) => (
        <a
          key={p}
          href={makeLink(p)}
          className={`rounded-lg px-3 py-2 text-sm ${
            p === page ? "bg-indigo-600 text-white" : "border hover:bg-gray-50"
          }`}
        >
          {p}
        </a>
      ))}
      <a
        href={makeLink(Math.min(pages, page + 1))}
        className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
      >
        Suivant →
      </a>
    </nav>
  );
}
