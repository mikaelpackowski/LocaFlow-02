// app/api/owners/register/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ⚠️ Validation minimale côté serveur
    if (!body?.email || !body?.password || !body?.firstName || !body?.lastName) {
      return NextResponse.json({ ok: false, message: "Champs manquants." }, { status: 400 });
    }

    // Ici tu brancheras ta vraie persistance (Supabase / Prisma / etc.)
    // Pour la démo on retourne juste un succès.
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, message: "Erreur serveur." }, { status: 500 });
  }
}
