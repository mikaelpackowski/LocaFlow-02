// app/(default)/annonces/nouvelle/page.tsx
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hasActiveOwnerSubscription } from "@/lib/subscriptions";
import { getSessionUserId } from "@/lib/auth"; // ← ton helper existant
import NewListingClient from "./NewListingClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login?returnTo=/annonces/nouvelle");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, email: true },
  });
  if (user?.role !== "owner") redirect("/tarifs?reason=not-owner");

  const ok = await hasActiveOwnerSubscription(userId);
  if (!ok) redirect("/tarifs?reason=need-plan");

  return <NewListingClient />;
}
