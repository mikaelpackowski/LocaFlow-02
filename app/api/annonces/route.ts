// app/api/annonces/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = (searchParams.get("q") ?? "").trim();
    const type = (searchParams.get("type") ?? "all").trim().toUpperCase();
    const max = Number(searchParams.get("max") ?? "") || undefined;
    const sort = (searchParams.get("sort") ?? "") as
      | "price_asc"
      | "price_desc"
      | "";
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 12)));

    // WHERE
    const where: any = {};
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { district: { contains: q, mode: "insensitive" } },
      ];
    }
    if (type !== "ALL" && type) {
      where.type = type; // suppose des valeurs ENUM en base (ex: "APPARTEMENT", "STUDIO", ...)
    }
    if (max) {
      // On filtre sur le loyer hors charges (ajuste si tu veux un total loyer+charges)
      where.rent = { lte: max };
    }

    // TRI
    const orderBy =
      sort === "price_asc"
        ? [{ rent: "asc" as const }]
        : sort === "price_desc"
        ? [{ rent: "desc" as const }]
        : [{ createdAt: "desc" as const }];

    const total = await prisma.listing.count({ where });
    const pages = Math.max(1, Math.ceil(total / limit));
    const skip = (page - 1) * limit;

    const items = await prisma.listing.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { images: true },
    });

    // Mise en forme légère pour ta ListingCard actuelle
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
    }));

    return NextResponse.json({
      ok: true,
      items: shaped,
      total,
      page,
      pages,
      limit,
    });
  } catch (e: any) {
    console.error("GET /api/annonces error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Erreur serveur" },
      { status: 500 }
    );
  }
}
