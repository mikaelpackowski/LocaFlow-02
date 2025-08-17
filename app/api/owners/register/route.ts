import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.email || !body?.password || !body?.firstName || !body?.lastName) {
      return NextResponse.json(
        { ok: false, message: "Champs manquants." },
        { status: 400 }
      );
    }

    // 🚧 Ici tu ajouteras la vraie sauvegarde (Prisma / Supabase)
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e.message || "Erreur serveur." },
      { status: 500 }
    );
  }
}
