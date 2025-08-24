// app/api/storage/upload/route.ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sanitizeFilename(name: string) {
  // sépare extension
  const dot = name.lastIndexOf(".");
  const ext = dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
  const base = dot >= 0 ? name.slice(0, dot) : name;

  // remplace tout ce qui n'est pas [a-z0-9._-] par "-"
  const safeBase = base
    .normalize("NFKD")              // enlève accents
    .replace(/[\u0300-\u036f]/g, "") // diacritiques
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "file";

  return ext ? `${safeBase}.${ext}` : safeBase;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 });

    // borne de sécurité (ex: 10 Mo)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 10 Mo)" }, { status: 413 });
    }

    const supabase = getSupabaseAdmin();

    // nom sûr
    const safeName = sanitizeFilename(file.name);
    const key = `uploads/${Date.now()}-${safeName}`;

    const arrayBuffer = await file.arrayBuffer();
    const { data, error } = await supabase.storage
      .from("annonces") // ⚠️ bucket doit exister et être public
      .upload(key, Buffer.from(arrayBuffer), {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) {
      // messages plus explicites
      const msg = /Invalid key/i.test(error.message)
        ? `Nom de fichier invalide après nettoyage: ${key}`
        : /Bucket not found/i.test(error.message)
        ? `Bucket "annonces" introuvable (crée-le et rends-le public).`
        : error.message;
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const { data: pub } = supabase.storage.from("annonces").getPublicUrl(key);

    return NextResponse.json({
      ok: true,
      path: data?.path,
      publicUrl: pub.publicUrl,
      filename: safeName,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Erreur upload" }, { status: 500 });
  }
}
