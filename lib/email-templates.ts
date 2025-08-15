// lib/email-templates.ts

export function ownerIncidentHtml(input: {
  propertyTitle?: string;
  category: string;
  urgency: "faible" | "moyenne" | "haute";
  description: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  role: "tenant" | "owner";
}) {
  const {
    propertyTitle,
    category,
    urgency,
    description,
    contactName,
    contactEmail,
    contactPhone,
    role,
  } = input;

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,'Helvetica Neue',Arial,'Noto Sans',sans-serif;line-height:1.5;color:#111827">
    <h2 style="margin:0 0 12px 0">Nouveau ticket ${role === "tenant" ? "locataire" : "propriétaire"}</h2>
    <p style="margin:0 0 16px 0;color:#374151">
      Un incident vient d'être créé dans LocaFlow.
    </p>

    <table style="border-collapse:collapse;width:100%;max-width:640px">
      <tbody>
        ${propertyTitle ? row("Bien", escape(propertyTitle)) : ""}
        ${row("Catégorie", escape(category))}
        ${row("Urgence", escape(urgency))}
        ${row("Description", nl2br(escape(description)))}
        ${row("Contact", `${escape(contactName)} &lt;${escape(contactEmail)}&gt;${contactPhone ? ` / ${escape(contactPhone)}` : ""}`)}
      </tbody>
    </table>

    <p style="margin-top:16px;color:#374151">
      Connectez-vous à votre espace LocaFlow pour suivre et traiter ce ticket.
    </p>
  </div>
  `;
}

function row(label: string, content: string) {
  return `
    <tr>
      <td style="padding:6px 8px;border:1px solid #E5E7EB;background:#F9FAFB;width:180px;font-weight:600">${label}</td>
      <td style="padding:6px 8px;border:1px solid #E5E7EB">${content}</td>
    </tr>
  `;
}

function escape(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function nl2br(str: string) {
  return str.replace(/\n/g, "<br/>");
}
