"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  defaultPlan?: string; // peut être un alias (proprietaire/premium/business) ou un price_…
};

const PLAN_LABELS: Record<string, string> = {
  proprietaire: "Propriétaire – 14 € / mois",
  premium: "Premium – 29 € / mois",
  business: "Business – 79 € / mois",
};

function humanizePlan(value?: string) {
  if (!value) return { label: "Gratuit", hint: "Aucun abonnement sélectionné" };
  const key = value.toLowerCase();
  if (PLAN_LABELS[key]) return { label: PLAN_LABELS[key], hint: "Plan sélectionné" };
  if (value.startsWith("price_")) return { label: "Plan sélectionné", hint: "Price ID Stripe" };
  if (value.startsWith("prod_")) return { label: "Plan sélectionné", hint: "Product ID Stripe" };
  return { label: "Plan sélectionné", hint: value };
}

export default function RegisterForm({ defaultPlan }: Props) {
  const [showPwd, setShowPwd] = useState(false);

  const planInfo = humanizePlan(defaultPlan);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    // TODO: remplace ensuite par ton vrai endpoint d’inscription en base
    const res = await fetch("/api/owners/register", {
      method: "POST",
      body: JSON.stringify({
        firstName: form.get("firstName"),
        lastName: form.get("lastName"),
        email: form.get("email"),
        password: form.get("password"),
        plan: form.get("plan"), // on garde le plan tel quel
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data?.message || "Erreur à l’inscription");
      return;
    }

    // Redirection Checkout Stripe (GET) – la route sait gérer alias/price_/prod_
    const plan = String(form.get("plan") || "");
    window.location.href = plan
      ? `/api/billing/checkout?plan=${encodeURIComponent(plan)}`
      : "/tarifs";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Bandeau plan choisi */}
      <div className="rounded-xl border bg-gray-50 px-4 py-3 flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-gray-600">Abonnement</div>
          <div className="font-medium text-gray-900">{planInfo.label}</div>
          <div className="text-xs text-gray-500">{planInfo.hint}</div>
        </div>
        <Link
          href="/tarifs"
          className="rounded-full border px-3 py-1.5 text-sm font-medium hover:bg-white"
        >
          Changer
        </Link>
      </div>

      {/* Champs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="col-span-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Prénom
          </label>
          <input
            type="text"
            name="firstName"
            required
            placeholder="Votre prénom"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div className="col-span-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nom
          </label>
          <input
            type="text"
            name="lastName"
            required
            placeholder="Votre nom"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="col-span-1 sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="vous@exemple.com"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div className="col-span-1 sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              name="password"
              required
              minLength={8}
              placeholder="••••••••"
              className="w-full rounded-lg border px-3 py-2 pr-24 outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute inset-y-0 right-2 my-1 rounded-md border px-2 text-xs font-medium hover:bg-gray-50"
              aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPwd ? "Masquer" : "Afficher"}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            8 caractères minimum. Évitez de réutiliser un mot de passe.
          </p>
        </div>
      </div>

      {/* Champ plan technique (caché visuellement mais envoyé) */}
      <input type="hidden" name="plan" value={defaultPlan || ""} />

      {/* Consentements */}
      <div className="flex items-start gap-2 text-sm">
        <input type="checkbox" required className="mt-1" />
        <span className="text-gray-600">
          J’accepte les{" "}
          <Link href="/conditions" className="text-violet-600 underline">
            Conditions d’utilisation
          </Link>{" "}
          et la{" "}
          <Link href="/confidentialite" className="text-violet-600 underline">
            Politique de confidentialité
          </Link>
          .
        </span>
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-violet-600 px-5 py-2.5 font-semibold text-white hover:bg-violet-500"
      >
        Créer mon compte
      </button>

      <p className="text-center text-sm text-gray-500">
        Déjà un compte ?{" "}
        <Link href="/auth/login" className="text-violet-600 underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
