// app/api/annonces/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/** Stub d'authentification → à remplacer par ton vrai système (NextAuth, Supabase Auth...) */
async function getSessionUserId(): Promise<string | null> {
  return null; // TODO: renvoyer l'id de l'utilisateur connecté
}

/** Récupère l'id dynamique directement depuis l'URL */
function getIdFromUrl(req: Request): string {
  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean);
  const idx = parts.findIndex((p) => p === "annonces");
  return idx >= 0 && parts[idx + 1] ? parts[idx + 1] : "";
}

// ---------- GET ONE ----------
export async function GET(req: Request) {
  try {
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const ad = await prisma.listing.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sort: "asc" } },
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    if (!ad) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, listing: ad });
  } catch (e: any) {
    console.error("GET /api/annonces/[id] error:", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "Erreur serveur" }, { status: 500 });
  }
}

// ---------- UPDATE ----------
export async function PUT(req: Request) {
  try {
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const ownerId = await getSessionUserId();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.listing.findUnique({
      where: { id },
      select: { ownerId: true },
    });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing.ownerId !== ownerId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const data: any = {};

    if (body.title != null) data.title = String(body.title);
    if (body.description != null) data.description = String(body.description);
    if (body.city != null) data.city = String(body.city);
    if (body.address != null) data.address = body.address ? String(body.address) : null;
    if (body.rent != null) data.rent = Number(body.rent);
    if (body.charges != null) data.charges = Number(body.charges);
    if (body.bedrooms != null) data.bedrooms = Number(body.bedrooms);
    if (body.surface != null) data.surface = Number(body.surface);
    if (body.furnished != null) data.furnished = Boolean(body.furnished);
    if (body.lat != null) data.lat = Number(body.lat);
    if (body.lng != null) data.lng = Number(body.lng);
    if (body.availableAt != null) data.availableAt = body.availableAt ? new Date(body.availableAt) : null;
    if (body.type != null) data.type = String(body.type).toUpperCase();
    if (body.leaseType != null) data.leaseType = String(body.leaseType).toUpperCase();
    if (body.status != null) data.status = String(body.status).toUpperCase();

    let result;
    if (Array.isArray(body.images)) {
      result = await prisma.$transaction(async (tx) => {
        await tx.listingImage.deleteMany({ where: { listingId: id } });
        await tx.listing.update({ where: { id }, data });
        if (body.images.length) {
          await tx.listingImage.createMany({
            data: body.images.filter(Boolean).map((url: string, idx: number) => ({
              url,
              alt: null,
              listingId: id,
              sort: idx,
            })),
          });
        }
        return tx.listing.findUnique({
          where: { id },
          include: { images: { orderBy: { sort: "asc" } } },
        });
      });
    } else {
      result = await prisma.listing.update({
        where: { id },
        data,
        include: { images: { orderBy: { sort: "asc" } } },
      });
    }

    return NextResponse.json({ ok: true, listing: result });
  } catch (e: any) {
    console.error("PUT /api/annonces/[id] error:", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "Erreur serveur" }, { status: 500 });
  }
}

// ---------- DELETE ----------
export async function DELETE(req: Request) {
  try {
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const ownerId = await getSessionUserId();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.listing.findUnique({
      where: { id },
      select: { ownerId: true },
    });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing.ownerId !== ownerId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.listing.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("DELETE /api/annonces/[id] error:", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "Erreur serveur" }, { status: 500 });
  }
}
