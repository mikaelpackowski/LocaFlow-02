import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { buildChecklist, scoreApplication, SCORE_THRESHOLD } from "@/lib/application-assistant";

export const runtime = "nodejs";

// POST: créer/maj dossier (idempotent par pair listing/applicant)
export async function POST(req: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const listingId = String(body.listingId || "");
    if (!listingId) return NextResponse.json({ error: "listingId requis" }, { status: 400 });

    const profile = {
      isStudent: !!body.isStudent,
      hasGuarantor: !!body.hasGuarantor,
      monthlyNetIncome: body.monthlyNetIncome ? Number(body.monthlyNetIncome) : undefined,
      contractType: body.contractType ?? "AUTRE",
    };

    // upsert application
    const app = await prisma.application.upsert({
      where: {
        // composite unique constraint conseillée IRL (ajoute @@unique([listingId, applicantId]) si souhaité)
        id: (await prisma.application.findFirst({
          where: { listingId, applicantId: userId },
          select: { id: true },
        }))?.id ?? "___no___", // force create si none
      },
      create: {
        listingId,
        applicantId: userId,
        status: "DRAFT",
        note: null,
      },
      update: {}, // rien ici pour l'instant
      include: {
        listing: { select: { rent: true, leaseType: true } },
        documents: true,
      },
    });

    // construire checklist & scoring courant
    const checklist = buildChecklist(
      { rent: app.listing.rent, leaseType: app.listing.leaseType },
      profile
    );
    const required = checklist.filter((c) => c.required).length;
    const docsOk = app.documents.filter((d) => d.status === "VALID").length;
    const score = scoreApplication({ rent: app.listing.rent }, profile, docsOk, required);

    // si SUBMITTED et score >= threshold => PREQUALIFIED
    let status = app.status;
    if (app.status === "SUBMITTED" && score >= SCORE_THRESHOLD) {
      status = "PREQUALIFIED";
      await prisma.application.update({ where: { id: app.id }, data: { status, score } });
    } else {
      await prisma.application.update({ where: { id: app.id }, data: { score } });
    }

    return NextResponse.json({ ok: true, applicationId: app.id, score, status, checklist });
  } catch (e: any) {
    console.error("POST /api/applications", e);
    return NextResponse.json({ error: e?.message ?? "Erreur serveur" }, { status: 500 });
  }
}

// GET: mes dossiers (applicant)
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apps = await prisma.application.findMany({
    where: { applicantId: userId },
    include: { listing: { select: { title: true, city: true, rent: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ ok: true, items: apps });
}
