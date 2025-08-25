// lib/subscriptions.ts
import { prisma } from "@/lib/prisma";

/**
 * Retourne true si l'utilisateur a un abonnement actif
 * ou un essai en cours (currentPeriodEnd >= maintenant).
 */
export async function hasActiveOwnerSubscription(userId: string): Promise<boolean> {
  const now = new Date();
  const sub = await prisma.subscription.findFirst({
    where: {
      userId,
      OR: [
        { status: "ACTIVE" },
        { status: "TRIALING", currentPeriodEnd: { gte: now } },
      ],
    },
    select: { id: true },
  });
  return !!sub;
}

/**
 * (Optionnel) Nombre de jours restants d'essai/abonnement.
 * Utile pour afficher un ruban “il reste X jours”.
 */
export async function getRemainingDays(userId: string): Promise<number | null> {
  const now = new Date();
  const sub = await prisma.subscription.findFirst({
    where: {
      userId,
      OR: [
        { status: "ACTIVE" },
        { status: "TRIALING", currentPeriodEnd: { gte: now } },
      ],
    },
    select: { currentPeriodEnd: true },
    orderBy: { createdAt: "desc" },
  });

  if (!sub?.currentPeriodEnd) return null;
  const ms = sub.currentPeriodEnd.getTime() - now.getTime();
  return ms > 0 ? Math.ceil(ms / (1000 * 60 * 60 * 24)) : 0;
}
