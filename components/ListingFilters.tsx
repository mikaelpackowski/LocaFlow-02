"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

export default function ListingFilters() {
  const router = useRouter();
  const sp = useSearchParams();

  const [q, setQ] = useState(sp.get("q") ?? "");
  const [city, setCity] = useState(sp.get("city") ?? "");
  const [type, setType] = useState(sp.get("type") ?? "");
  const [furnished, setFurnished] = useState(sp.get("furnished") ?? "");
  const [sort, setSort] = useState(sp.get("sort") ?? "recent");

  useEffect(() => {
    setQ(sp.get("q") ?? "");
    setCity(sp.get("city") ?? "");
    setType(sp.get("type") ?? "");
    setFurnished(sp.get("furnished") ?? "");
    setSort(sp.get("sort") ?? "recent");
  }, [sp]);

  const apply = useCallback(() => {
    const params = new URLSearchParams(sp.toString());
    q ? params.set("q", q) : params.delete("q");
    city ? params.set("city", city) : params.delete("city");
    type ? params.set("type", type) : params.delete("type");
    furnished ? params.set("furnished", furnished) : params.delete("furnished");
    sort ? params.set("sort", sort) : params.delete("sort");
    params.set("page", "1");
    router.push(`/annonces?${params.toString()}`);
  }, [router, sp, q, city, type, furnished, sort]);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm grid grid-cols-1 gap-3 md:grid-cols-6">
      <input
        value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="Rechercher un titre, une description…"
        className="md:col-span-2 rounded-lg border px-3 py-2"
      />
      <input
        value={city} onChange={(e) => setCity(e.target.value)}
        placeholder="Ville"
        className="rounded-lg border px-3 py-2"
      />
      <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border px-3 py-2">
        <option value="">Type</option>
        <option>APPARTEMENT</option>
        <option>MAISON</option>
        <option>STUDIO</option>
        <option>LOFT</option>
        <option>LOCAL</option>
      </select>
      <select value={furnished} onChange={(e) => setFurnished(e.target.value)} className="rounded-lg border px-3 py-2">
        <option value="">Meublé ?</option>
        <option value="true">Oui</option>
        <option value="false">Non</option>
      </select>
      <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border px-3 py-2">
        <option value="recent">Plus récentes</option>
        <option value="rent_asc">Loyer ↑</option>
        <option value="rent_desc">Loyer ↓</option>
      </select>
      <button onClick={apply} className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500">
        Appliquer
      </button>
    </div>
  );
}
