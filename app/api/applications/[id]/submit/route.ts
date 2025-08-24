import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { buildChecklist, scoreApplication, SCORE_THRESHOLD } from "@/lib/application-assistant";

export const runtime = "nodejs";

function getIdFromUrl(req: Request) {
  const u = new URL(req.url);
  const parts = u.pathname.split("/").filter(Boolean);
  const idx = parts.findIndex((p) => p === "applications");
  return idx >= 0 ? parts[idx + 1] : "";
}

export async function POST(req: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const appId = getIdFromUrl(req);
    const app = await prisma.application.findUnique({
      where: { id: appId },
      include: { listing: true, documents: true },
    });
    if (!app || app.applicantId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Vérifie complétude minimale
    const profile = {}; // tu peux récupérer les infos candidat si tu les stockes
    const checklist = buildChecklist(app.listing, profile);
    const required = checklist.filter((c) => c.required).map((c) => c.type);
    const present = new Set(app.documents.map((d) => d.type));
    const missing = required.filter((t) => !present.has(t));

    if (missing.length > 0) {
      return NextResponse.json({ error: "Documents manquants", missing }, { status: 400 });
    }

    const docsOk = app.documents.filter((d) => d.status === "VALID").length;
    const score = scoreApplication(app.listing, {}, docsOk, required.length);
    const status = score >= SCORE_THRESHOLD ? "PREQUALIFIED" : "SUBMITTED";

    await prisma.application.update({ where: { id: app.id }, data: { status, score } });

    return NextResponse.json({ ok: true, status, score });
  } catch (e: any) {
    console.error("POST /api/applications/[id]/submit", e);
    return NextResponse.json({ error: e?.message ?? "Erreur serveur" }, { status: 500 });
  }
}
