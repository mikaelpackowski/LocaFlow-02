import ListingCard from "@/components/ListingCard";
import ListingFilters from "@/components/ListingFilters";

async function fetchListings(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(searchParams)) {
    if (!v) continue;
    Array.isArray(v) ? v.forEach((vv) => params.append(k, vv)) : params.set(k, v);
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/listings?` + params.toString(), {
    cache: "no-store",
  });
  return res.json();
}

export const metadata = {
  title: "Annonces – ForGesty",
  description: "Trouvez votre prochain logement parmi nos annonces vérifiées.",
};

export default async function AnnoncesPage({ searchParams }: { searchParams?: Promise<Record<string, string>> }) {
  const sp = (searchParams ? await searchParams : {}) || {};
  const data = await fetchListings(sp);
  const { items = [], total = 0, page = 1, pageSize = 12 } = data || {};
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-16 space-y-8">
      <header className="text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Annonces <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">ForGesty</span>
        </h1>
        <p className="mt-2 text-gray-600">Filtrez par ville, type, loyer, et plus.</p>
      </header>

      <ListingFilters />

      {/* Résultats */}
      <section>
        <div className="mb-3 text-sm text-gray-600">{total} résultat{total > 1 ? "s" : ""}</div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((l: any) => (
            <ListingCard key={l.id} {...l} />
          ))}
        </div>

        {/* Pagination simple */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Pagination current={Number(page)} total={totalPages} />
          </div>
        )}
      </section>
    </main>
  );
}

function Pagination({ current, total }: { current: number; total: number }) {
  const list = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <nav className="flex flex-wrap items-center gap-2">
      {list.map((p) => {
        const params = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);
        params.set("page", String(p));
        const href = `/annonces?${params.toString()}`;
        const active = p === current;
        return (
          <a
            key={p}
            href={href}
            className={[
              "rounded-full px-3 py-1 text-sm",
              active ? "bg-violet-600 text-white" : "border hover:bg-gray-50",
            ].join(" ")}
          >
            {p}
          </a>
        );
      })}
    </nav>
  );
}
