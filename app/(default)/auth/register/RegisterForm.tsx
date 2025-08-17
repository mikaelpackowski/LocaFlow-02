"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  /** Optionnel : preselect depuis l’URL (?plan=price_xxx)  */
  defaultPlan?: string;
};

export default function RegisterForm({ defaultPlan = "" }: Props) {
  const router = useRouter();

  // Champs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [role, setRole] = useState<"owner" | "tenant">("owner");
  const [planId, setPlanId] = useState(defaultPlan);

  // UI
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg]   = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrMsg(null);
    setLoading(true);

    const payload = {
      firstName: firstName.trim(),
      lastName : lastName.trim(),
      email    : email.trim(),
      password,
      role,
      plan     : planId || undefined, // optionnel
    };

    try {
      const res = await fetch("/api/owners/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json")
        ? await res.json()
        : { ok: false, message: await res.text() };

      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || `Erreur ${res.status}`);
      }

      // Succès : on envoie vers la connexion (tu peux changer la cible)
      router.push("/auth/login?registered=1");
    } catch (err: any) {
      setErrMsg(err?.message || "Erreur inattendue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {errMsg && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-800">Prénom</label>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="Alex"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800">Nom</label>
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="Martin"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800">Email</label>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
          placeholder="vous@exemple.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800">Mot de passe</label>
        <input
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
          placeholder="••••••••"
        />
      </div>

      {/* Rôle */}
      <div>
        <div className="text-sm font-medium text-gray-800">Je suis</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole("owner")}
            className={`rounded-lg border px-3 py-2 text-sm ${
              role === "owner"
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "hover:bg-gray-50"
            }`}
          >
            Propriétaire
          </button>
          <button
            type="button"
            onClick={() => setRole("tenant")}
            className={`rounded-lg border px-3 py-2 text-sm ${
              role === "tenant"
                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                : "hover:bg-gray-50"
            }`}
          >
            Locataire
          </button>
        </div>
      </div>

      {/* Plan optionnel (pré-sélection Stripe Price ID) */}
      <div>
        <label className="block text-sm font-medium text-gray-800">
          Plan (facultatif)
        </label>
        <input
          type="text"
          value={planId}
          onChange={(e) => setPlanId(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
          placeholder="price_xxx (Stripe priceId)"
        />
        {defaultPlan && (
          <p className="mt-1 text-xs text-gray-500">
            Pré-sélectionné depuis l’URL : <span className="font-mono">{defaultPlan}</span>
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
      >
        {loading ? "Création en cours…" : "Créer mon compte"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Déjà inscrit ?{" "}
        <a href="/auth/login" className="font-medium text-indigo-600 hover:underline">
          Se connecter
        </a>
      </p>
    </form>
  );
}
