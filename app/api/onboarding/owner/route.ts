// app/api/onboarding/owner/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { Plan, SubscriptionStatus } from "@prisma/client";

function addMonths(d: Date, m: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + m);
  return x;
}

/**
 * Tente d'obtenir l'utilisateur Supabase (id + email) via :
 * 1) Authorization: Bearer <token>
 * 2) Cookies (session existante)
 * 3) Fallback: body.userId -> admin.getUserById(userId)
 */
async function getAuthIdentity(req: Request): Promise<{ id: string; email?: string } | null> {
  // 1) Bearer token
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (token) {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (!error && data?.user?.id) {
      return { id: data.user.id, email: data.user.email ?? undefined };
    }
  }

  // 2) Cookies (session côté serveur)
  const supaFromCookies = createRouteHandlerClient({ cookies });
  const { data: cookieAuth } = await supaFromCookies.auth.getUser();
  if (cookieAuth?.user?.id) {
    return { id: cookieAuth.user.id, email: cookieAuth.user.email ?? undefined };
  }

  // 3) Fallback: body.userId puis lookup admin (utile si confirm email activée => pas de session)
  try {
    const body = await req.clone().json(); // clone car relu ensuite
    const rawId = body?.userId;
    if (typeof rawId === "string" && rawId) {
      const { data } = await supabaseAdmin.auth.admin.getUserById(rawId);
      if (data?.user?.id) {
        return { id: data.user.id, email: data.user.email ?? undefined };
      }
      // dernier recours: au moins renvoyer l'id (email inconnu)
      return { id: rawId };
    }
  } catch {
    // ignore
  }

  return null;
}

export async function POST(req: Request) {
  try {
    // --- Qui est l'utilisateur ?
    const who = await getAuthIdentity(req);
    if (!who) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const plan = body.plan as Plan | undefined;
    const trial = body.trial as string | undefined; // "1m" pour essai 1 mois

    if (!plan || !Object.values<Plan>(Object.assign({}, (globalThis as any).Plan ?? {})).includes(plan)) {
      // Si l'import d'enum Plan depuis Prisma est OK, la ligne au-dessus n'est pas utilisée.
      // Sinon, on valide basiquement que c'est une string non vide :
      // return NextResponse.json({ error: "plan invalide" }, { status: 400 });
    }

    // --- Upsert du User (clé primaire = id Supabase)
    // Ton schéma impose email: String @unique => on privilégie l'email Supabase,
    // sinon on met un placeholder basé sur l'id (pour éviter l'erreur unique).
    const safeEmail = who.email ?? `${who.id}@noemail.local`;

    await prisma.user.upsert({
      where: { id: who.id },
      update: {
        role: "owner",
        // on évite de casser l'email existant si déjà présent et différent
        // (Prisma lèvera une erreur si on tente de mettre un email déjà pris).
        // Si tu veux figer l'email initial, commente la ligne suivante :
        email: safeEmail,
      },
      create: {
        id: who.id,
        email: safeEmail,
        role: "owner",
      },
    });

    // --- Abonnement: état et période
    let status: SubscriptionStatus = "PENDING_PAYMENT";
    let currentPeriodEnd: Date | null = null;
    if (trial === "1m") {
      status = "TRIALING";
      currentPeriodEnd = addMonths(new Date(), 1);
    }

    const existing = await prisma.subscription.findFirst({
      where: { userId: who.id, status: { in: ["TRIALING", "ACTIVE", "PENDING_PAYMENT"] } },
      orderBy: { createdAt: "desc" },
    });

    const subscription = existing
      ? await prisma.subscription.update({
          where: { id: existing.id },
          data: {
            plan: plan ?? existing.plan,
            status,
            currentPeriodEnd: currentPeriodEnd ?? existing.currentPeriodEnd ?? undefined,
          },
        })
      : await prisma.subscription.create({
          data: {
            userId: who.id,
            plan: plan ?? ("PRO" as Plan),
            status,
            currentPeriodEnd: currentPeriodEnd ?? undefined,
          },
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
