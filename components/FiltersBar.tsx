// app/api/annonces/route.ts
import { NextRequest, NextResponse } from "next/server";
import { LISTINGS } from "@/utils/listings";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const q = (searchParams.get("q") || "").toLowerCase().trim();
  const min = Number(searchParams.get("min") || 0);
  const max = Number(searchParams.get("max") || 0);
  const city = (searchParams.get("city") || "").toLowerCase().trim();
  const type = (searchParams.get("type") || "").toLowerCase().trim(); // vide ou 'appartement' etc.
  const sort = searchParams.get("sort") as "price_asc" | "price_desc" | null;

  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.max(1, Math.min(48, Number(searchParams.get("limit") || 9)));

  // 1) Filtrage
  let items = LISTINGS.filter((l) => {
    // q sur titre / ville / quartier
    const hay =
      `${l.title} ${l.city ?? ""} ${l.district ?? ""}`.toLowerCase();
    if (q && !hay.includes(q)) return false;

    if (city && (l.city ?? "").toLowerCase() !== city) return false;

    if (type && type !== "all" && (l.type ?? "").toLowerCase() !== type)
      return false;

    if (min && l.price < min) return false;
    if (max && l.price > max) return false;

    return true;
  });

  // 2) Tri
  if (sort === "price_asc") {
    items = items.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    items = items.sort((a, b) => b.price - a.price);
  }

  // 3) Pagination
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const end = start + limit;
  const slice = items.slice(start, end);

  return NextResponse.json({
    items: slice,
    total,
    page,
    pages,
    limit,
  });
}
