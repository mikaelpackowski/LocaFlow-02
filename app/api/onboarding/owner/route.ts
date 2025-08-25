import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { Plan, SubscriptionStatus } from "@prisma/client";

function addMonths(d: Date, m: number) { const x = new Date(d); x.setMonth(x.getMonth() + m); return x; }

async function getUserIdFromRequest(req: Request): Promise<string | null> {
  // 1) Bearer token (préféré)
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (token) {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (!error && data?.user?.id) return data.user.id;
  }

  // 2) Fallback cookies (si l’utilisateur a déjà une session valide)
  const c = await cookies();
  const supaFromCookies = createRouteHandlerClient({ cookies: () => c });
  const { data } = await supaFromCookies.auth.getUser();
  if (data?.user?.id) return data.user.id;

  return null;
}

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const plan = body.plan as Plan | undefined;
    const trial = body.trial as string | undefined; // "1m" possible

    if (!plan || !Object.values(Plan).includes(plan)) {
      return NextResponse.json({ error: "plan invalide" }, { status: 400 });
    }

    // Marquer owner
    await prisma.user.update({ where: { id: userId }, data: { role: "owner" } });

    // Créer/mettre à jour l’abonnement d’essai
    let status: SubscriptionStatus = "PENDING_PAYMENT";
    let currentPeriodEnd: Date | null = null;
    if (trial === "1m") { status = "TRIALING"; currentPeriodEnd = addMonths(new Date(), 1); }

    const existing = await prisma.subscription.findFirst({
      where: { userId, status: { in: ["TRIALING", "ACTIVE", "PENDING_PAYMENT"] } },
      orderBy: { createdAt: "desc" },
    });

    const subscription = existing
      ? await prisma.subscription.update({
          where: { id: existing.id },
          data: { plan, status, currentPeriodEnd: currentPeriodEnd ?? existing.currentPeriodEnd },
        })
      : await prisma.subscription.create({
          data: { userId, plan, status, currentPeriodEnd: currentPeriodEnd ?? undefined },
        });

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
