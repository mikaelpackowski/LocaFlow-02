// app/api/tickets/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Schéma Zod : on valide tous les champs “texte”.
 * Les fichiers sont validés séparément (taille, type, nombre).
 */
const TicketSchema = z.object({
  role: z.enum(["tenant", "owner"], { required_error: "Rôle requis" }),
  title: z.string().min(3, "Titre trop court").max(120, "Titre trop long"),
  description: z.string().min(10, "Description trop courte").max(5000, "Description trop longue"),
  urgency: z.enum(["faible", "moyenne", "haute"]).default("moyenne"),
  email: z.string().email("Email invalide"),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[+0-9() .-]{6,20}$/.test(val), "Téléphone invalide"),
  propertyId: z.string().optional(),
});

const MAX_FILES = 5;
const MAX_FILE_MB = 5;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(req: Request) {
  try {
    // On accepte soit du multipart/form-data (avec images), soit du JSON simple
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();

      // Récupérer les images (peuvent arriver sous “images” multiple)
      const images = form.getAll("images").filter(Boolean) as File[];

      // Construire un objet brut pour Zod (strings)
      const raw = {
        role: String(form.get("role") || ""),
        title: String(form.get("title") || ""),
        description: String(form.get("description") || ""),
        urgency: String(form.get("urgency") || "moyenne").toLowerCase(),
        email: String(form.get("email") || ""),
        phone: form.get("phone") ? String(form.get("phone")) : undefined,
        propertyId: form.get("propertyId") ? String(form.get("propertyId")) : undefined,
      };

      const parsed = TicketSchema.safeParse(raw);
      if (!parsed.success) {
        return NextResponse.json(
          { ok: false, errors: parsed.error.format() },
          { status: 400 }
        );
      }

      // Validation fichiers
      if (images.length > MAX_FILES) {
        return NextResponse.json(
          { ok: false, errors: { images: `Max ${MAX_FILES} fichiers.` } },
          { status: 400 }
        );
      }

      for (const f of images) {
        if (!ALLOWED_MIME.has(f.type)) {
          return NextResponse.json(
            { ok: false, errors: { images: "Formats autorisés : JPG, PNG, WEBP." } },
            { status: 400 }
          );
        }
        const sizeMB = f.size / (1024 * 1024);
        if (sizeMB > MAX_FILE_MB) {
          return NextResponse.json(
            { ok: false, errors: { images: `Chaque fichier ≤ ${MAX_FILE_MB} Mo.` } },
            { status: 400 }
          );
        }
      }

      // TODO UPLOAD: envoyer les fichiers vers un stockage (Cloudinary / S3).
      // Pour l’instant on les "ignore" proprement :
      const uploads: string[] = []; // URLs des images une fois stockées (à implémenter)

      // TODO MAIL: notifier par email (Resend/Nodemailer)
      // await sendTicketEmail(parsed.data, uploads);

      // TODO DB: persister en base
      // await prisma.ticket.create({ data: { ...parsed.data, images: uploads } });

      return NextResponse.json(
        { ok: true, ticket: { ...parsed.data, images: uploads } },
        { status: 201 }
      );
    }

    // Fallback JSON (si formulaire sans upload)
    const body = await req.json().catch(() => ({}));
    const parsed = TicketSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, errors: parsed.error.format() },
        { status: 400 }
      );
    }

    // TODO MAIL / DB comme ci-dessus

    return NextResponse.json({ ok: true, ticket: parsed.data }, { status: 201 });
  } catch (err) {
    console.error("POST /api/tickets error:", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
