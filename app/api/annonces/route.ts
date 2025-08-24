import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// GET /api/annonces?q=&city=&max=&type=&sort=&page=&limit=
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = (searchParams.get("q") ?? "").trim();
    const city = (searchParams.get("city") ?? "").trim();
    const type = (searchParams.get("type") ?? "").trim(); // "all" = pas de filtre
    const max = Number(searchParams.get("max") ?? "");
    const sort = (searchParams.get("sort") ?? "") as "" | "price_asc" | "price_desc";
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 12)));
    const skip = (page - 1) * limit;

    // --- WHERE
    const where: any = {};

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { district: { contains: q, mode: "insensitive" } },
      ];
    }

    if (city) {
      // filtre strict sur la ville choisie dans le select
      where.city = city;
    }

    if (type && type !== "all") {
      // ne pas forcer en UPPERCASE : on respecte la valeur stockée
      where.type = type;
    }

    if (!Number.isNaN(max) && max > 0) {
      where.rent = { lte: max };
    }

    // --- ORDER BY
    const orderBy =
      sort === "price_asc"
        ? [{ rent: "asc" as const }]
        : sort === "price_desc"
        ? [{ rent: "desc" as const }]
        : [{ createdAt: "desc" as const }];

    // --- QUERY
    const [total, items] = await Promise.all([
      prisma.listing.count({ where }),
      prisma.listing.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { images: true },
      }),
    ]);

    const pages = Math.max(1, Math.ceil(total / limit));

    const shaped = items.map((l) => ({
      id: l.id,
      title: l.title,
      city: l.city,
      type: l.type,
      rent: l.rent,
      charges: l.charges,
      bedrooms: l.bedrooms,
      surface: l.surface,
      furnished: l.furnished,
      image: l.images?.[0]?.url ?? null,
      // si tu veux exposer d'autres champs (reference, createdAt...), ajoute-les ici
    }));

    return NextResponse.json({ ok: true, items: shaped, total, page, pages, limit });
  } catch (e: any) {
    console.error("GET /api/annonces error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Erreur serveur" },
      { status: 500 }
    );
  }
}
