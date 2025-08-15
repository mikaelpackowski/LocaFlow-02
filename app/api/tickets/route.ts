// app/api/tickets/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

// ---- Helpers “IA light” (placeholder) ---------------------------------------
function classifyIncident(input: { title?: string; description?: string }) {
  const text = `${input.title ?? ""} ${input.description ?? ""}`.toLowerCase();

  // Catégorisation ultra simple (remplaçable par un appel IA plus tard)
  let category: "plomberie" | "électricité" | "chauffage" | "sinistre" | "autre" = "autre";
  if (/(fuite|robinet|canalis|eau)/.test(text)) category = "plomberie";
  else if (/(prise|court|électri|panne de courant)/.test(text)) category = "électricité";
  else if (/(chaudière|radiateur|chauffage)/.test(text)) category = "chauffage";
  else if (/(dégât des eaux|sinistre|inondation)/.test(text)) category = "sinistre";

  // Priorité simple
  let priority: "haute" | "normale" | "basse" = "normale";
  if (/(inondation|court-circuit|danger)/.test(text)) priority = "haute";
  if (/(goutte|léger|mineur)/.test(text)) priority = "basse";

  return { category, priority };
}

// ---- Email (Resend) ---------------------------------------------------------
const resend = new Resend(process.env.RESEND_API_KEY);

async function notifyOwnerEmail({
  ownerEmail,
  ticket,
}: {
  ownerEmail: string;
  ticket: any;
}) {
  const from = process.env.ALERTS_FROM_EMAIL || "LocaFlow <alerts@example.com>";
  const subject = `🛠️ Nouveau problème signalé – ${ticket.title}`;

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Helvetica,Arial;">
      <h1>Nouveau problème signalé</h1>
      <p><strong>Titre :</strong> ${escapeHtml(ticket.title)}</p>
      <p><strong>Catégorie :</strong> ${ticket.ai.category} — <strong>Priorité :</strong> ${ticket.ai.priority}</p>
      <p><strong>Description :</strong><br/>${escapeHtml(ticket.description)}</p>
      ${
        ticket.propertyId
          ? `<p><strong>Bien :</strong> ${escapeHtml(ticket.propertyId)}</p>`
          : ""
      }
      ${
        ticket.photos?.length
          ? `<p><strong>Photos :</strong><br/>${ticket.photos
              .map((u: string) => `<a href="${u}">${u}</a>`)
              .join("<br/>")}</p>`
          : ""
      }
      <p style="margin-top:16px">
        <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://locaflow.com"}/proprietaire/problemes" 
           style="display:inline-block;padding:10px 14px;border-radius:8px;background:#4f46e5;color:#fff;text-decoration:none">
          Ouvrir dans LocaFlow
        </a>
      </p>
    </div>
  `;

  await resend.emails.send({
    from,
    to: ownerEmail,
    subject,
    html,
  });
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// ---- POST /api/tickets ------------------------------------------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Validation minimale (pas de zod ici pour éviter une dépendance)
    const title = (body.title || "").toString().trim();
    const description = (body.description || "").toString().trim();
    const propertyId = body.propertyId ? String(body.propertyId) : undefined;
    const tenantEmail = body.tenantEmail ? String(body.tenantEmail) : undefined;
    const explicitOwnerEmail = body.ownerEmail ? String(body.ownerEmail) : undefined;
    const photos = Array.isArray(body.photos)
      ? body.photos.filter((u: any) => typeof u === "string")
      : [];

    if (!title || !description) {
      return NextResponse.json(
        { ok: false, error: "Titre et description sont requis." },
        { status: 400 }
      );
    }

    // 🧠 “IA” locale pour catégoriser/prioriser
    const ai = classifyIncident({ title, description });

    // ⚠️ Récupération email propriétaire
    //  - idéalement via la DB en partant de propertyId
    //  - ici on prend ownerEmail fourni par le front, sinon fallback .env
    const ownerEmail =
      explicitOwnerEmail ||
      process.env.OWNER_FALLBACK_EMAIL ||
      ""; // vide si rien

    if (!ownerEmail) {
      // On ne bloque pas la création du ticket, mais on signale qu’aucune notif n’a été envoyée
      console.warn("[tickets] Aucun ownerEmail fourni et pas de OWNER_FALLBACK_EMAIL");
    }

    // 💾 Mock “enregistrement” du ticket (à remplacer par DB plus tard)
    const ticket = {
      id: crypto.randomUUID(),
      title,
      description,
      photos,
      propertyId,
      tenantEmail,
      ai, // { category, priority }
      status: "new",
      createdAt: new Date().toISOString(),
    };

    // ✉️ Envoi de l’alerte au propriétaire (si possible)
    if (ownerEmail) {
      try {
        await notifyOwnerEmail({ ownerEmail, ticket });
      } catch (err) {
        console.error("Erreur envoi email propriétaire:", err);
        // On renvoie quand même le ticket créé
        return NextResponse.json(
          { ok: true, ticket, warn: "Ticket créé mais email non envoyé." },
          { status: 201 }
        );
      }
    }

    return NextResponse.json({ ok: true, ticket }, { status: 201 });
  } catch (e) {
    console.error("Erreur tickets POST:", e);
    return NextResponse.json({ ok: false, error: "Erreur serveur" }, { status: 500 });
  }
}
