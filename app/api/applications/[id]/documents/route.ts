import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export const runtime = "nodejs";

function getIdFromUrl(req: Request) {
  const u = new URL(req.url);
  const parts = u.pathname.split("/").filter(Boolean);
  // /api/applications/[id]/documents
  const idx = parts.findIndex((p) => p === "applications");
  return idx >= 0 ? parts[idx + 1] : "";
}

// POST: attacher un document à un dossier
export async function POST(req: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const appId = getIdFromUrl(req);
    const body = await req.json();
    const { type, url } = body;

    if (!appId || !type || !url) {
      return NextResponse.json({ error: "type et url requis" }, { status: 400 });
    }

    const app = await prisma.application.findUnique({ where: { id: appId }, select: { applicantId: true } });
    if (!app || app.applicantId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const doc = await prisma.applicationDocument.create({
      data: {
        applicationId: appId,
        type,
        url,
        status: "PENDING",
      },
    });

    return NextResponse.json({ ok: true, document: doc });
  } catch (e: any) {
    console.error("POST /api/applications/[id]/documents", e);
    return NextResponse.json({ error: e?.message ?? "Erreur serveur" }, { status: 500 });
  }
}
