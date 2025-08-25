// lib/subscriptions.ts
import { prisma } from "@/lib/prisma";

export async function hasActiveOwnerSubscription(userId: string) {
  const now = new Date();
  const sub = await prisma.subscription.findFirst({
    where: {
      userId,
      OR: [
        { status: "ACTIVE" },
        { status: "TRIALING", currentPeriodEnd: { gte: now } },
      ],
    },
  });
  return !!sub;
}
