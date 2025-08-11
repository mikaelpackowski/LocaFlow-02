import { NextRequest, NextResponse } from "next/server";
import { LISTINGS } from "@/utils/listings";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const q = (searchParams.get("q") ?? "").toLowerCase().trim();
  const city = (searchParams.get("city") ?? "").toLowerCase().trim();
  const min = Number(searchParams.get("min") ?? 0);
  const max = Number(searchParams.get("max") ?? 0);
  const type = (searchParams.get("type") ?? "all").toLowerCase();
  const sort = searchParams.get("sort") as "price_asc" | "price_desc" | null;

  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.max(1, Number(searchParams.get("limit") ?? 9));

  let items = LISTINGS.slice();

  // Recherche texte
  if (q) {
    items = items.filter((l) => {
      const blob = `${l.title} ${l.city} ${l.district ?? ""} ${l.description ?? ""}`.toLowerCase();
      return blob.includes(q);
    });
  }

  // Ville / arrondissement
  if (city) {
    items = items.filter(
      (l) =>
        l.city?.toLowerCase() === city ||
        l.district?.toLowerCase() === city
    );
  }

  // Min / Max
  if (!Number.isNaN(min) && min > 0) {
    items = items.filter((l) => Number(l.price) >= min);
  }
  if (!Number.isNaN(max) && max > 0) {
    items = items.filter((l) => Number(l.price) <= max);
  }

  // Type
  if (type && type !== "all") {
    items = items.filter((l) => l.type?.toLowerCase() === type);
  }

  // Tri
  if (sort === "price_asc") {
    items.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sort === "price_desc") {
    items.sort((a, b) => Number(b.price) - Number(a.price));
  }

  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const end = start + limit;
  const pageItems = items.slice(start, end);

  return NextResponse.json({
    items: pageItems,
    total,
    page,
    pages,
    limit,
  });
}
