// app/api/onboarding/owner/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth"; // ta fonction existante qui lit la session Supabase/NextAuth
import { Plan, SubscriptionStatus } from "@prisma/client";

type TrialParam = "1m" | "" | null | undefined;

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export async function POST(req: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Lis body JSON éventuellement
    const body = await req.json().catch(() => ({} as any));
    const planRaw: string | undefined = body.plan ?? undefined;
    const trialRaw: TrialParam =
      body.trial ??
      ((): TrialParam => {
        // fallback: autorise trial=... en query string aussi
        const url = new URL(req.url);
        return (url.searchParams.get("trial") as TrialParam) ?? undefined;
      })();

    if (!planRaw) {
      return NextResponse.json({ error: "plan requis" }, { status: 400 });
    }
    if (!Object.values(Plan).includes(planRaw as Plan)) {
      return NextResponse.json({ error: "plan invalide" }, { status: 400 });
    }
    const plan = planRaw as Plan;

    // 1) Marque l'utilisateur comme owner si ce n'est pas déjà le cas
    await prisma.user.update({
      where: { id: userId },
      data: { role: "owner" },
    });

    // 2) Détermine statut + fin de période
    let status: SubscriptionStatus = "PENDING_PAYMENT";
    let currentPeriodEnd: Date | null = null;

    if (trialRaw === "1m") {
      status = "TRIALING";
      currentPeriodEnd = addMonths(new Date(), 1); // +1 mois à partir d'aujourd'hui
    }

    // 3) Si une sub active/trial/pending existe déjà, on évite les doublons
    const existing = await prisma.subscription.findFirst({
      where: { userId, status: { in: ["TRIALING", "ACTIVE", "PENDING_PAYMENT"] } },
      orderBy: { createdAt: "desc" },
    });

    let subscription;
    if (existing) {
      // On met à jour le plan & la date de fin si trial est demandé
      subscription = await prisma.subscription.update({
        where: { id: existing.id },
        data: {
          plan,
          status,
          currentPeriodEnd: currentPeriodEnd ?? existing.currentPeriodEnd,
        },
      });
    } else {
      // Sinon, on crée
      subscription = await prisma.subscription.create({
        data: {
          userId,
          plan,
          status,
          currentPeriodEnd: currentPeriodEnd ?? undefined,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      subscription: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd,
      },
    });
  } catch (e: any) {
    console.error("POST /api/onboarding/owner error:", e);
    return NextResponse.json({ error: e?.message ?? "Erreur serveur" }, { status: 500 });
  }
}
