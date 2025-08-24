import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseLeaseType, parsePropertyType, parseStatus, getSessionUserId } from "@/lib/listings-helpers";

export const runtime = "nodejs";

// ---------- READ ONE ----------
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const ad = await prisma.listing.findUnique({
      where: { id: params.id },
      include: { images: { orderBy: { sort: "asc" } }, owner: { select: { id: true, name: true, email: true } } },
    });
    if (!ad) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, listing: ad });
  } catch (e: any) {
    console.error("GET /api/annonces/[id] error:", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "Erreur serveur" }, { status: 500 });
  }
}

// ---------- UPDATE ----------
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const ownerId = await getSessionUserId();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.listing.findUnique({ where: { id: params.id }, select: { ownerId: true } });
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
    if (body.surface != null) data.surface = body.surface != null ? Number(body.surface) : null;
    if (body.furnished != null) data.furnished = Boolean(body.furnished);
    if (body.lat != null) data.lat = body.lat != null ? Number(body.lat) : null;
    if (body.lng != null) data.lng = body.lng != null ? Number(body.lng) : null;
    if (body.availableAt != null) data.availableAt = body.availableAt ? new Date(body.availableAt) : null;

    if (body.type != null) data.type = parsePropertyType(String(body.type));
    if (body.leaseType != null) data.leaseType = parseLeaseType(String(body.leaseType));
    if (body.status != null) data.status = parseStatus(String(body.status));

    // Images : si tu envoies { images: string[] } on remplace tout simplement l’ordre
    let txResult;
    if (Array.isArray(body.images)) {
      txResult = await prisma.$transaction(async (tx) => {
        await tx.listingImage.deleteMany({ where: { listingId: params.id } });
        await tx.listing.update({
          where: { id: params.id },
          data,
        });
        if (body.images.length) {
          await tx.listingImage.createMany({
            data: body.images.filter(Boolean).map((url: string, idx: number) => ({
              url,
              alt: null,
              listingId: params.id,
              sort: idx,
            })),
          });
        }
        return tx.listing.findUnique({
          where: { id: params.id },
          include: { images: { orderBy: { sort: "asc" } } },
        });
      });
    } else {
      txResult = await prisma.listing.update({
        where: { id: params.id },
        data,
        include: { images: { orderBy: { sort: "asc" } } },
      });
    }

    return NextResponse.json({ ok: true, listing: txResult });
  } catch (e: any) {
    console.error("PUT /api/annonces/[id] error:", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "Erreur serveur" }, { status: 500 });
  }
}

// ---------- DELETE ----------
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const ownerId = await getSessionUserId();
    if (!ownerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.listing.findUnique({ where: { id: params.id }, select: { ownerId: true } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing.ownerId !== ownerId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.listing.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("DELETE /api/annonces/[id] error:", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "Erreur serveur" }, { status: 500 });
  }
}
