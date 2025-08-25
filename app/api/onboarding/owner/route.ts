// app/api/onboarding/owner/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { Plan, SubscriptionStatus } from "@prisma/client";

function addMonths(d: Date, m: number) { const x = new Date(d); x.setMonth(x.getMonth() + m); return x; }

async function getUserIdFromRequest(req: Request): Promise<string | null> {
  const supabase = createSupabaseServerClient();
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user.id;
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

    // Marque owner
    await prisma.user.update({ where: { id: userId }, data: { role: "owner" } });

    let status: SubscriptionStatus = "PENDING_PAYMENT";
    let currentPeriodEnd: Date | null = null;
    if (trial === "1m") { status = "TRIALING"; currentPeriodEnd = addMonths(new Date(), 1); }

    // Upsert sub
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
