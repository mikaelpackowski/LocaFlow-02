// lib/listings-helpers.ts
import { ListingStatus, LeaseType, PropertyType } from "@prisma/client";

/** Convertit un string (venant d’un formulaire) vers les enums Prisma, sinon lève une erreur lisible */
export function parsePropertyType(v: string): PropertyType {
  const up = (v || "").toUpperCase();
  switch (up) {
    case "APPARTEMENT":
    case "MAISON":
    case "STUDIO":
    case "LOFT":
    case "LOCAL":
      return up as PropertyType;
    default:
      throw new Error(`Type de bien invalide: ${v}`);
  }
}
export function parseLeaseType(v: string): LeaseType {
  const up = (v || "").toUpperCase();
  switch (up) {
    case "VIDE":
    case "MEUBLE":
      return up as LeaseType;
    default:
      throw new Error(`Type de bail invalide: ${v}`);
  }
}
export function parseStatus(v?: string | null): ListingStatus {
  const up = (v || "PUBLISHED").toUpperCase();
  switch (up) {
    case "PUBLISHED":
    case "DRAFT":
    case "ARCHIVED":
      return up as ListingStatus;
    default:
      return "PUBLISHED";
  }
}

/** TODO: remplace par TON auth (NextAuth, Supabase Auth, …) */
export async function getSessionUserId(): Promise<string | null> {
  // Exemple NextAuth :
  // const session = await getServerSession(authOptions);
  // return session?.user?.id ?? null;

  // Exemple Supabase (Route Handler):
  // const supabase = createRouteHandlerClient({ cookies });
  // const { data: { user } } = await supabase.auth.getUser();
  // return user?.id ?? null;

  return null; // <-- remplace-moi
}

/** Label FR affichable si tu veux humaniser les enums dans l’UI */
export const propertyTypeLabel = (t: PropertyType) =>
  ({ APPARTEMENT: "Appartement", MAISON: "Maison", STUDIO: "Studio", LOFT: "Loft", LOCAL: "Local" }[t]);
