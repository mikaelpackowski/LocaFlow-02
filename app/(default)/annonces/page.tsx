// app/(default)/annonces/page.tsx
import ListingCard from "@/components/ListingCard";
import SearchBar from "@/components/SearchBar";
import SortSelect from "@/components/SortSelect";
import { headers } from "next/headers";

export const metadata = {
  title: "Annonces | ForGesty",
  description: "Trouvez votre logement et filtrez selon vos critères.",
};

export const dynamic = "force-dynamic";

// Normalise string | string[] | undefined -> string
function toStr(v: string | string[] | undefined): string {
  return Array.isArray(v) ? (v[0] ?? "") : (v ?? "");
}

// Base URL fiable (Next 15: headers() est async)
async function buildBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

// ✅ signature conforme à l’App Router
export default async function AnnoncesPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const sp = searchParams ?? {};

  const q = toStr(sp.q).trim();
  const max = toStr(sp.max).trim();
  const type = toStr(sp.type).trim();
  const sort = toStr(sp.sort).trim();
  const page = Number(toStr(sp.page) || 1);
  const limit = Number(toStr(sp.limit) || 12);

  const sortSafe: "" | "price_asc" | "price_desc" =
    sort === "price_asc" || sort === "price_desc" ? (sort as any) : "";

  // ---- META : remplir villes/types
  const base = await buildBaseUrl();
  let cities: string[] = [];
  let types: string[] = [];
  try {
    const metaRes = await fetch(`${base}/api/annonces?limit=500`, { cache: "no-store" });
    if (metaRes.ok) {
      const meta = await metaRes.json();
      const all = Array.isArray(meta.items) ? meta.items : [];
      const citySet = new Set<string>();
      const typeSet = new Set<string>();
      for (const it of all) {
        if (it?.city) citySet.add(it.city);
        if (it?.type) typeSet.add(it.type);
      }
      cities = Array.from(citySet).sort((a, b) => a.localeCompare(b, "fr"));
      types = Array.from(typeSet).sort((a, b) => a.localeCompare(b, "fr"));
    }
  } catch {
    // silencieux
  }

  // ---- DATA : annonces filtrées
  const qs = new URLSearchParams();
  if (q) qs.set("q", q);
  if (max) qs.set("max", max);
  if (type && type !== "all") qs.set("type", type);
  if (sortSafe) qs.set("sort", sortSafe);
  qs.set("page", String(page));
  qs.set("limit", String(limit));

  const apiUrl = `${base}/api/annonces${qs.toString() ? `?${qs.toString()}` : ""}`;

  let data: any = { items: [], total: 0, page: 1, pages: 1, limit };
  try {
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`API status ${res.status}`);
    data = await res.json();
  } catch (e) {
    console.error("Erreur fetch /api/annonces:", e);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      {/* Header aligné sur Tarifs */}
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Annonces{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            ForGesty
          </span>
        </h1>
        <p className="mt-3 text-gray-600">
          Explorez les biens disponibles et filtrez selon vos critères.
        </p>
      </header>

      {/* Barre de recherche alimentée */}
      <SearchBar
        defaultQuery={q}
        defaultMax={max}
        defaultType={type || "all"}
        defaultSort={sortSafe}
        cities={cities}
        types={types}
      />

      {/* Tri */}
      <div className="mt-4 flex justify-end">
        <form method="get" className="flex items-center gap-2">
          <input type="hidden" name="q" defaultValue={q} />
          <input type="hidden" name="max" defaultValue={max} />
          <input type="hidden" name="type" defaultValue={type || "all"} />
          <SortSelect defaultValue={sortSafe} />
        </form>
      </div>

      {/* Liste / Pagination */}
      {!data?.items || data.items.length === 0 ? (
        <div className="mt-10 text-center text-gray-500">
          Aucune annonce ne correspond à vos critères.
          <div className="mt-3 text-xs">
            (Debug :{" "}
            <a href={apiUrl} className="underline text-indigo-600" target="_blank" rel="noreferrer">
              voir JSON API
            </a>
            )
          </div>
        </div>
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
                image={l.image ?? null}
              />
            ))}
          </div>

          <Pagination
            total={data.total}
            page={data.page}
            pages={data.pages}
            limit={data.limit}
            searchParams={{ q, max, type, sort: sortSafe || "" }}
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
      <a href={makeLink(Math.max(1, page - 1))} className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
        ← Précédent
      </a>
      {pagesToShow.map((p) => (
        <a
          key={p}
          href={makeLink(p)}
          className={`rounded-lg px-3 py-2 text-sm ${p === page ? "bg-indigo-600 text-white" : "border hover:bg-gray-50"}`}
        >
          {p}
        </a>
      ))}
      <a href={makeLink(Math.min(pages, page + 1))} className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
        Suivant →
      </a>
    </nav>
  );
}
