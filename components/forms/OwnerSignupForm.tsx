"use client";

import { useState } from "react";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  password: string;
  confirm: string;
  accept: boolean;
};

export default function OwnerSignupForm() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOk(null);
    setErr(null);

    const form = new FormData(e.currentTarget);
    const data: FormState = {
      firstName: String(form.get("firstName") || "").trim(),
      lastName: String(form.get("lastName") || "").trim(),
      email: String(form.get("email") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      company: String(form.get("company") || "").trim(),
      password: String(form.get("password") || ""),
      confirm: String(form.get("confirm") || ""),
      accept: form.get("accept") === "on",
    };

    if (!data.firstName || !data.lastName) return setErr("Nom et prénom requis.");
    if (!/^\S+@\S+\.\S+$/.test(data.email)) return setErr("Email invalide.");
    if (data.password.length < 8) return setErr("Mot de passe trop court (8+).");
    if (data.password !== data.confirm) return setErr("Les mots de passe ne correspondent pas.");
    if (!data.accept) return setErr("Veuillez accepter les conditions.");

    try {
      setLoading(true);
      const res = await fetch("/api/owners/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json?.message || "Erreur serveur");

      setOk("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
      (e.currentTarget as HTMLFormElement).reset();
    } catch (e: any) {
      setErr(e?.message || "Une erreur s'est produite.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
      {err && <p className="rounded-md bg-rose-50 text-rose-700 px-3 py-2 text-sm">{err}</p>}
      {ok && <p className="rounded-md bg-emerald-50 text-emerald-700 px-3 py-2 text-sm">{ok}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Prénom *</label>
          <input name="firstName" required className="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom *</label>
          <input name="lastName" required className="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email *</label>
          <input type="email" name="email" required className="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Téléphone</label>
          <input name="phone" className="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Société (optionnel)</label>
        <input name="company" className="mt-1 w-full rounded-lg border px-3 py-2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Mot de passe *</label>
          <input type="password" name="password" required className="mt-1 w-full rounded-lg border px-3 py-2" />
          <p className="mt-1 text-xs text-gray-500">8 caractères minimum</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirmer *</label>
          <input type="password" name="confirm" required className="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>
      </div>

      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="accept" className="mt-1" />
        <span>
          J’accepte les <a className="underline" href="/cgu" target="_blank">conditions d’utilisation</a>.
        </span>
      </label>

      <div className="mt-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {loading ? "Création en cours…" : "Créer mon compte"}
        </button>
        <a href="/auth/login?role=owner" className="text-sm text-indigo-600 hover:underline">
          J’ai déjà un compte
        </a>
      </div>
    </form>
  );
}
