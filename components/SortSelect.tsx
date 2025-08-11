"use client";

type Props = {
  defaultValue?: "" | "price_asc" | "price_desc";
};

export default function SortSelect({ defaultValue = "" }: Props) {
  return (
    <select
      name="sort"
      defaultValue={defaultValue}
      className="rounded-lg border px-3 py-2 text-sm"
      aria-label="Trier par prix"
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
    >
      <option value="">Trier par…</option>
      <option value="price_asc">Prix croissant</option>
      <option value="price_desc">Prix décroissant</option>
    </select>
  );
}
