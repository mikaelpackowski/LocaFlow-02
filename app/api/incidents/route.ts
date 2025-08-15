import { NextResponse } from "next/server";
import { z } from "zod";
import { resend, FROM_EMAIL, FALLBACK_TO } from "@/lib/resend";
import { ownerIncidentHtml } from "@/lib/email-templates";

// Schema de validation (robuste & typé)
const IncidentSchema = z.object({
  role: z.enum(["tenant", "owner"]),
  propertyTitle: z.string().optional(),
  category: z.string().min(2, "Catégorie requise"),
  urgency: z.enum(["faible", "moyenne", "haute"]),
  description: z.string().min(5, "Description trop courte"),
  contactName: z.string().min(2, "Nom requis"),
  contactEmail: z.string().email("Email invalide"),
  contactPhone: z.string().optional(),
  // optionnel: si tu l’envoies depuis le formulaire
  ownerEmail: z.string().email().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = IncidentSchema.parse(json);

    // Cible: ownerEmail fourni OU fallback env
    const to = data.ownerEmail || FALLBACK_TO;
    if (!to) {
      return NextResponse.json(
        { ok: false, error: "Aucun destinataire défini (ownerEmail manquant et ALERTS_FALLBACK_TO vide)" },
        { status: 400 }
      );
    }

    const subject =
      data.role === "tenant"
        ? `LocaFlow — Nouveau problème signalé${data.propertyTitle ? ` · ${data.propertyTitle}` : ""}`
        : `LocaFlow — Nouveau ticket propriétaire${data.propertyTitle ? ` · ${data.propertyTitle}` : ""}`;

    // Envoi email
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
      return NextResponse.json({ ok: false, error: String(res.error) }, { status: 500 });
    }

    // (Optionnel) renvoyer un ID de ticket si tu en crées un plus tard
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err?.issues) {
      // Erreurs Zod
      return NextResponse.json({ ok: false, errors: err.issues }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: err?.message || "Erreur serveur" }, { status: 500 });
  }
}
