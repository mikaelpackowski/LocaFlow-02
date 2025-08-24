import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export const runtime = "nodejs";

function getSlotId(req: Request) {
  const u = new URL(req.url);
  const parts = u.pathname.split("/").filter(Boolean);
  const idx = parts.findIndex((p) => p === "slots");
  return idx >= 0 ? parts[idx + 1] : "";
}

// Réserver un slot si PREQUALIFIED
export async function POST(req: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const slotId = getSlotId(req);
  const { applicationId } = await req.json();

  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { listing: { select: { id: true } } },
  });
  if (!app || app.applicantId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (app.status !== "PREQUALIFIED") return NextResponse.json({ error: "Scoring insuffisant" }, { status: 400 });

  const slot = await prisma.visitSlot.findUnique({ where: { id: slotId } });
  if (!slot || slot.listingId !== app.listingId) return NextResponse.json({ error: "Slot invalide" }, { status: 400 });
  if (slot.booked >= slot.capacity) return NextResponse.json({ error: "Complet" }, { status: 400 });

  const updated = await prisma.visitSlot.update({
    where: { id: slot.id },
    data: { booked: { increment: 1 } },
  });
  await prisma.application.update({
    where: { id: app.id },
    data: { visitSlotId: slot.id },
  });

  return NextResponse.json({ ok: true, slot: updated });
}
