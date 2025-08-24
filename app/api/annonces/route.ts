// app/api/annonces/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { PropertyType, LeaseType, ListingStatus } from "@prisma/client";

export const runtime = "nodejs";

/* ---------------- Helpers enums ---------------- */
function parsePropertyType(v: string): PropertyType {
  const up = (v || "").toUpperCase();
  const ok = ["APPARTEMENT", "MAISON", "STUDIO", "LOFT", "LOCAL"] as const;
  if ((ok as readonly string[]).includes(up)) return up as PropertyType;
  throw new Error(`Type de bien invalide: ${v}`);
}
function parseLeaseType(v: string): LeaseType {
  const up = (v || "").toUpperCase();
  const ok = ["VIDE", "MEUBLE"] as const;
  if ((ok as readonly string[]).includes(up)) return up as LeaseType;
  throw new Error(`Type de bail invalide: ${v}`);
}
function parseStatus(v?: string | null): ListingStatus {
  const up = (v || "PUBLISHED").toUpperCase();
  const ok = ["PUBLISHED", "DRAFT", "ARCHIVED"] as const;
  return (ok as readonly string[]).includes(up) ? (up as ListingStatus) : "PUBLISHED";
}

/* ---------------- Auth stub (à remplacer par ton auth réelle) ---------------- */
async function getSessionUserId(): Promise<string | null> {
  // TODO: branche ici NextAuth ou Supabase Auth et renvoie l'id user
  return null;
}

/* ---------------- POST: créer une annonce ---------------- */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Auth réelle (stub) OU mode test: ownerId fourni dans le body si ALLOW_UNAUTH_POST=1
    let ownerId = await getSessionUserId();
    if (!ownerId && process.env.ALLOW_UNAUTH_POST === "1") {
      const raw = String(body.ownerId ?? "").trim();
      ownerId = raw || null;
    }
    if (!ownerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Requis
    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim();
    const city = String(body.city ?? "").trim();
    const type = parsePropertyType(String(body.type ?? ""));
    const leaseType = parseLeaseType(String(body.leaseType ?? ""));
    if (!title || !description || !city) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    // Numériques non-nullables (d’après ton schema)
    const rent = Number(body.rent ?? 0);
    const charges = Number(body.charges ?? 0);
    const bedrooms = Number(body.bedrooms ?? 0);
    const surface = body.surface === null || body.surface === undefined ? 0 : Number(body.surface);

    // Autres champs
    const furnished = Boolean(body.furnished ?? false);
    const status = parseStatus(body.status);
    const address = body.address ? String(body.address) : null;
    const lat = body.lat === null || body.lat === undefined ? null : Number(body.lat);
    const lng = body.lng === null || body.lng === undefined ? null : Number(body.lng);
    const availableAt = body.availableAt ? new Date(body.availableAt) : null;

    // Images: tableau d’URLs optionnel
    const images: string[] = Array.isArray(body.images) ? body.images.filter(Boolean) : [];

    const created = await prisma.listing.create({
      data: {
        ownerId,
        title,
        description,
        type,        // enum PropertyType
        leaseType,   // enum LeaseType
        city,
        address,     // String | null
        lat,         // Float? -> null OK
        lng,         // Float? -> null OK
        rent,        // Int
        charges,     // Int
        bedrooms,    // Int
        surface,     // Int (non-null)
        furnished,   // Boolean
        status,      // enum ListingStatus
        availableAt, // DateTime? -> null OK
        images: images.length
          ? {
              create: images.map((url, idx) => ({ url, alt: null, sort: idx })),
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

/* ---------------- GET: lister les annonces (filtrées) ---------------- */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const q = (searchParams.get("q") ?? "").trim();
    const city = (searchParams.get("city") ?? "").trim();
    const typeStr = (searchParams.get("type") ?? "").trim();       // APPARTEMENT|MAISON|...
    const leaseStr = (searchParams.get("leaseType") ?? "").trim(); // VIDE|MEUBLE
    const max = Number(searchParams.get("max") ?? "");
    const sort = (searchParams.get("sort") ?? "") as "" | "price_asc" | "price_desc";
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 12)));
    const skip = (page - 1) * limit;

    const where: any = { status: "PUBLISHED" as ListingStatus };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
      ];
    }
    if (city) where.city = city;

    if (typeStr && typeStr !== "all") {
      try {
        where.type = parsePropertyType(typeStr);
      } catch {
        where.type = "__NO_MATCH__"; // force 0 résultat si invalide
      }
    }

    if (leaseStr && leaseStr !== "all") {
      try {
        where.leaseType = parseLeaseType(leaseStr);
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
      type: l.type,
      leaseType: l.leaseType,
      rent: l.rent,
      charges: l.charges,
      bedrooms: l.bedrooms,
      surface: l.surface,
      furnished: l.furnished,
      status: l.status,
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
