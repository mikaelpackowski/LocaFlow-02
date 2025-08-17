"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Role = "owner" | "tenant";

export default function RegisterForm() {
  const router = useRouter();
  const sp = useSearchParams();

  // IMPORTANT : on NE parse PAS en JSON – c'est juste une string
  const planFromUrl = useMemo(() => (sp?.get("plan") ?? "").trim(), [sp]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("owner");
  const [plan, setPlan] = useState(planFromUrl); // garde la valeur telle quelle
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/owners/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ✅ On envoie du JSON correct (pas de JSON.parse sur plan)
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          plan, // ← simple string (ex: "price_123")
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Erreur serveur");
      }

      // Succès : si un plan est présent, on enchaîne sur le checkout
      // Sinon on envoie vers le dashboard selon le rôle
      if (plan) {
        // on pousse vers une route qui initie le checkout (si tu as mis ce flux)
        const q = new URLSearchParams({ plan, mode: "subscription" });
        router.push(`/api/billing/checkout?${q.toString()}`);
      } else {
        router.push(role === "owner" ? "/proprietaire/dashboard" : "/locataire/dashboard");
      }
    } catch (err: any) {
      setErrMsg(err.message || "Erreur serveur");
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

      <div>
        <label className="text-sm font-medium text-gray-800">Nom</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
          placeholder="Ex: Marie Dupont"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-800">Email</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
          placeholder="vous@exemple.com"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-800">Mot de passe</label>
        <input
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-800">Je suis</label>
        <div className="mt-1 grid grid-cols-2 gap-2">
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

      {/* Plan (si présent dans l’URL) – en lecture seule, mais modifiable si besoin */}
      <div>
        <label className="text-sm font-medium text-gray-800">
          Plan (facultatif)
        </label>
        <input
          type="text"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
          placeholder="ex: price_123 (Stripe)"
        />
        {planFromUrl && (
          <p className="mt-1 text-xs text-gray-500">
            Pré-sélectionné depuis l’URL : <code>{planFromUrl}</code>
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
