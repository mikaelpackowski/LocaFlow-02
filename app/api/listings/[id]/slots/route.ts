import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export const runtime = "nodejs";

function getListingId(req: Request) {
  const u = new URL(req.url);
  const parts = u.pathname.split("/").filter(Boolean);
  const idx = parts.findIndex((p) => p === "listings");
  return idx >= 0 ? parts[idx + 1] : "";
}

// GET: slots ouverts
export async function GET(req: Request) {
  const listingId = getListingId(req);
  const now = new Date();
  const slots = await prisma.visitSlot.findMany({
    where: { listingId, end: { gte: now } },
    orderBy: { start: "asc" },
  });
  return NextResponse.json({ ok: true, items: slots });
}

// POST: owner crée un slot
export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const listingId = getListingId(req);
  const owner = await prisma.listing.findUnique({ where: { id: listingId }, select: { ownerId: true } });
  if (!owner || owner.ownerId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const start = new Date(body.start);
  const end = new Date(body.end);
  const capacity = Number(body.capacity ?? 1);

  const slot = await prisma.visitSlot.create({
    data: { listingId, start, end, capacity },
  });
  return NextResponse.json({ ok: true, slot });
}
