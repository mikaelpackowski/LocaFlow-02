// lib/auth.ts
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

/** Récupère l'ID user depuis la session Supabase (cookies) */
export async function getSessionUserId(): Promise<string | null> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user.id; // ⚠️ On assume que User.id (Prisma) == Supabase Auth user.id
}

/**
 * (Optionnel mais recommandé)
 * S'assure qu'une ligne existe dans ta table Prisma `User` pour l'utilisateur Supabase.
 * Appelle-la au moment où tu crées une annonce, si tu veux auto-créer le profil app.
 */
export async function ensureAppUserFromSupabase(): Promise<{ id: string } | null> {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Upsert côté Prisma pour aligner les IDs
  const u = await prisma.user.upsert({
    where: { id: user.id },
    update: {
      email: user.email ?? undefined,
      updatedAt: new Date(),
    },
    create: {
      id: user.id,
      email: user.email ?? `${user.id}@no-email.local`,
      name: user.user_metadata?.name ?? null,
      role: "owner", // ou null/suivant ton modèle
    },
    select: { id: true },
  });

  return u;
}
