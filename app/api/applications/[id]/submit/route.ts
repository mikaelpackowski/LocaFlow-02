// app/api/applications/[id]/submit/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { buildChecklist, scoreApplication, SCORE_THRESHOLD } from "@/lib/application-assistant";
import { DocumentType } from "@prisma/client"; // ✅ importe l'enum

export const runtime = "nodejs";

function getIdFromUrl(req: Request) {
  const u = new URL(req.url);
  const parts = u.pathname.split("/").filter(Boolean);
  const idx = parts.findIndex((p) => p === "applications");
  return idx >= 0 ? parts[idx + 1] : "";
}

function toDocumentType(t: string): DocumentType | null {
  // ✅ garde seulement les valeurs reconnues par l'enum Prisma
  return (Object.values(DocumentType) as string[]).includes(t)
    ? (t as DocumentType)
    : null;
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

    // Tu peux alimenter un vrai profil si tu le stockes ailleurs
    const profile = {};
    const checklist = buildChecklist(app.listing, profile);

    // ✅ convertit les types requis (string) en enum DocumentType
    const requiredEnum = checklist
      .filter((c) => c.required)
      .map((c) => toDocumentType(c.type))
      .filter((v): v is DocumentType => v !== null);

    const present = new Set<DocumentType>(app.documents.map((d) => d.type));

    // ✅ compare enum vs enum (plus de mismatch)
    const missing = requiredEnum.filter((t) => !present.has(t));

    if (missing.length > 0) {
      // on renvoie des strings “propres” pour l’API
      return NextResponse.json(
        { error: "Documents manquants", missing: missing.map((m) => m.toString()) },
        { status: 400 }
      );
    }

    const docsOk = app.documents.filter((d) => d.status === "VALID").length;
    const score = scoreApplication(app.listing, {}, docsOk, requiredEnum.length);
    const status = score >= SCORE_THRESHOLD ? "PREQUALIFIED" : "SUBMITTED";

    await prisma.application.update({ where: { id: app.id }, data: { status, score } });

    return NextResponse.json({ ok: true, status, score });
  } catch (e: any) {
    console.error("POST /api/applications/[id]/submit", e);
    return NextResponse.json({ error: e?.message ?? "Erreur serveur" }, { status: 500 });
  }
}
