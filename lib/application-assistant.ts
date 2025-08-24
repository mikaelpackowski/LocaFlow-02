// lib/application-assistant.ts
import type { Listing, LeaseType } from "@prisma/client";

export type ChecklistItem = {
  type: string;            // DocumentType enum string
  label: string;
  required: boolean;
};

export type ApplicantProfile = {
  isStudent?: boolean;
  hasGuarantor?: boolean;
  monthlyNetIncome?: number; // en €
  contractType?: "CDI" | "CDD" | "INDEPENDANT" | "ETUDIANT" | "AUTRE";
};

export function buildChecklist(listing: Pick<Listing, "leaseType" | "rent">, profile: ApplicantProfile): ChecklistItem[] {
  const items: ChecklistItem[] = [
    { type: "IDENTITE", label: "Pièce d'identité", required: true },
    { type: "JUSTIF_DOMICILE", label: "Justificatif de domicile", required: true },
  ];

  if (profile.isStudent) {
    items.push({ type: "ATTESTATION_ETUDIANT", label: "Certificat de scolarité / carte étudiante", required: true });
    items.push({ type: "GARANT_IDENTITE", label: "Pièce d'identité du garant", required: true });
    items.push({ type: "GARANT_BULLETIN_1", label: "Bulletin de salaire du garant (M-1)", required: true });
    items.push({ type: "GARANT_BULLETIN_2", label: "Bulletin de salaire du garant (M-2)", required: true });
    items.push({ type: "GARANT_BULLETIN_3", label: "Bulletin de salaire du garant (M-3)", required: true });
  } else {
    // salarié / autres
    items.push({ type: "CONTRAT_TRAVAIL", label: "Contrat de travail / Attestation employeur", required: true });
    items.push({ type: "BULLETIN_SALAIRE_1", label: "Bulletin de salaire (M-1)", required: true });
    items.push({ type: "BULLETIN_SALAIRE_2", label: "Bulletin de salaire (M-2)", required: true });
    items.push({ type: "BULLETIN_SALAIRE_3", label: "Bulletin de salaire (M-3)", required: true });
    items.push({ type: "AVIS_IMPOSITION", label: "Dernier avis d'imposition", required: true });
  }

  // Garant si ratio revenu < 3x loyer (règle simple)
  const rent = listing.rent ?? 0;
  const ratio = rent > 0 && profile.monthlyNetIncome ? profile.monthlyNetIncome / rent : 0;
  const needGuarantor = profile.isStudent || ratio < 3;

  if (needGuarantor) {
    items.push({ type: "GARANT_IDENTITE", label: "Pièce d'identité du garant", required: true });
    items.push({ type: "GARANT_BULLETIN_1", label: "Bulletin de salaire du garant (M-1)", required: true });
    items.push({ type: "GARANT_BULLETIN_2", label: "Bulletin de salaire du garant (M-2)", required: true });
    items.push({ type: "GARANT_BULLETIN_3", label: "Bulletin de salaire du garant (M-3)", required: true });
  }

  return items;
}

export function scoreApplication(listing: Pick<Listing, "rent">, profile: ApplicantProfile, docsOk: number, docsRequired: number) {
  // scoring très simple : 70% revenu/loyer, 30% complétude dossier
  const rent = listing.rent ?? 0;
  const income = profile.monthlyNetIncome ?? 0;
  const ratio = rent > 0 ? income / rent : 0;

  const ratioScore = Math.max(0, Math.min(1, (ratio - 2) / 2)); // 0 si 2x, 1 si 4x+
  const docsScore = docsRequired > 0 ? docsOk / docsRequired : 0;

  const final = Math.round(70 * ratioScore + 30 * docsScore);
  return Math.max(0, Math.min(100, final));
}

export const SCORE_THRESHOLD = 60; // au-dessus => préqualifié (peut réserver une visite)
