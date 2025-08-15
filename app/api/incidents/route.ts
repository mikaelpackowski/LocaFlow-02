import { NextResponse } from "next/server";
import { z } from "zod";
import { resend, FROM_EMAIL, FALLBACK_TO } from "@/lib/resend";
import { ownerIncidentHtml } from "@/lib/email-templates";

const IncidentSchema = z.object({
  role: z.enum(["tenant", "owner"]),
  propertyTitle: z.string().optional(),
  category: z.string().min(2, "Catégorie requise"),
  urgency: z.enum(["faible", "moyenne", "haute"]),
  description: z.string().min(5, "Description trop courte"),
  contactName: z.string().min(2, "Nom requis"),
  contactEmail: z.string().email("Email invalide"),
  contactPhone: z.string().optional(),
  ownerEmail: z.string().email().optional(),
});

// Convertit un FormData (submit natif <form>) en objet
function formDataToObject(fd: FormData) {
  const obj: Record<string, any> = {};
  for (const [k, v] of fd.entries()) obj[k] = v;
  return obj;
}

export async function POST(req: Request) {
  try {
    // 1) Lire le body quelle que soit la méthode d’envoi
    const contentType = req.headers.get("content-type") || "";
    let raw: any;

    if (contentType.includes("application/json")) {
      raw = await req.json();
    } else if (contentType.includes("form")) {
      const fd = await req.formData();
      raw = formDataToObject(fd);
    } else {
      return NextResponse.json(
        { ok: false, error: `Content-Type non supporté: ${contentType}` },
        { status: 400 }
      );
    }

    // 2) Validation Zod
    const parsed = IncidentSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, errors: parsed.error.issues },
        { status: 400 }
      );
    }
    const data = parsed.data;

    // 3) Vérifs env
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "RESEND_API_KEY manquant coté serveur" },
        { status: 500 }
      );
    }
    if (!FROM_EMAIL) {
      return NextResponse.json(
        { ok: false, error: "ALERTS_FROM_EMAIL manquant" },
        { status: 500 }
      );
    }

    // 4) Destinataire
    const to = data.ownerEmail || FALLBACK_TO;
    if (!to) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Aucun destinataire défini (ownerEmail manquant et ALERTS_FALLBACK_TO vide)",
        },
        { status: 400 }
      );
    }

    // 5) Envoi
    const subject =
      data.role === "tenant"
        ? `LocaFlow — Nouveau problème signalé${data.propertyTitle ? ` · ${data.propertyTitle}` : ""}`
        : `LocaFlow — Nouveau ticket propriétaire${data.propertyTitle ? ` · ${data.propertyTitle}` : ""}`;

    const res = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html: ownerIncidentHtml({
        role: data.role,
        propertyTitle: data.propertyTitle,
        category: data.category,
        urgency: data.urgency,
        description: data.description,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
      }),
    });

    if (res.error) {
      // On renvoie l’erreur Resend lisible
      return NextResponse.json(
        { ok: false, error: String((res.error as any)?.message || res.error) },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    // Log côté serveur pour Vercel logs
    console.error("API /api/incidents error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
