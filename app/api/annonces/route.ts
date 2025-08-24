import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseLeaseType, parsePropertyType, parseStatus, getSessionUserId } from "@/lib/listings-helpers";

export const runtime = "nodejs";

// ---------- CREATE ----------
export async function POST(req: Request) {
  try {
    const ownerId = await getSessionUserId();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    // champs requis
    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim();
    const type = parsePropertyType(String(body.type ?? ""));
    const leaseType = parseLeaseType(String(body.leaseType ?? ""));
    const city = String(body.city ?? "").trim();

    if (!title || !type || !leaseType || !city) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    // champs numériques
    const rent = Number(body.rent ?? 0);
    const charges = Number(body.charges ?? 0);
    const bedrooms = Number(body.bedrooms ?? 0);
    const surface = body.surface != null ? Number(body.surface) : null;

    // autres
    const furnished = Boolean(body.furnished ?? false);
    const status = parseStatus(body.status);
    const address = body.address ? String(body.address) : null;
    const district = body.district ? String(body.district) : null; // si tu souhaites l’ajouter à ton modèle
    const lat = body.lat != null ? Number(body.lat) : null;
    const lng = body.lng != null ? Number(body.lng) : null;
    const availableAt = body.availableAt ? new Date(body.availableAt) : null;

    // images: tableau d’URLs (optionnel)
    const images: string[] = Array.isArray(body.images) ? body.images.filter(Boolean) : [];

    const created = await prisma.listing.create({
      data: {
        ownerId,
        title,
        description,
        type,
        leaseType,
        city,
        address,
        // district,  // si tu ajoutes le champ à ton modèle Listing
        lat: lat ?? undefined,
        lng: lng ?? undefined,
        rent,
        charges,
        bedrooms,
        surface: surface ?? undefined,
        furnished,
        status,
        availableAt: availableAt ?? undefined,
        images: images.length
          ? {
              create: images.map((url, idx) => ({
                url,
                alt: null,
                sort: idx,
              })),
            }
          : undefined,
      },
      include: { images: true, owner: { select: { id: true, email: true, name: true } } },
    });

    return NextResponse.json({ ok: true, listing: created }, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/annonces error:", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "Erreur serveur" }, { status: 500 });
  }
}

// ---------- LIST ----------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = (searchParams.get("q") ?? "").trim();
    const city = (searchParams.get("city") ?? "").trim();
    const type = (searchParams.get("type") ?? "").trim(); // enum string (APPARTEMENT, STUDIO...)
    const leaseType = (searchParams.get("leaseType") ?? "").trim(); // optionnel
    const max = Number(searchParams.get("max") ?? "");
    const sort = (searchParams.get("sort") ?? "") as "" | "price_asc" | "price_desc";
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 12)));
    const skip = (page - 1) * limit;

    // WHERE
    const where: any = {
      status: "PUBLISHED" as const, // on liste par défaut uniquement les publiées
    };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        // { address: { contains: q, mode: "insensitive" } },
      ];
    }
    if (city) where.city = city;
    if (type && type !== "all") {
      // valide enum: si invalide => aucun résultat
      try {
        where.type = parsePropertyType(type);
      } catch {
        where.type = "__NO_MATCH__"; // force zéro résultat si mauvais type
      }
    }
    if (leaseType && leaseType !== "all") {
      try {
        where.leaseType = parseLeaseType(leaseType);
      } catch {
        where.leaseType = "__NO_MATCH__";
      }
    }
    if (!Number.isNaN(max) && max > 0) {
      where.rent = { lte: max };
    }

    const orderBy =
      sort === "price_asc"
        ? [{ rent: "asc" as const }]
        : sort === "price_desc"
        ? [{ rent: "desc" as const }]
        : [{ createdAt: "desc" as const }];

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
      type: l.type,             // enum PropertyType
      leaseType: l.leaseType,   // enum LeaseType
      rent: l.rent,
      charges: l.charges,
      bedrooms: l.bedrooms,
      surface: l.surface,
      furnished: l.furnished,
      status: l.status,         // enum ListingStatus
      image: l.images?.[0]?.url ?? null,
      createdAt: l.createdAt,
      availableAt: l.availableAt,
    }));

    return NextResponse.json({ ok: true, items: shaped, total, page, pages, limit });
  } catch (e: any) {
    console.error("GET /api/annonces error:", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "Erreur serveur" }, { status: 500 });
  }
}
