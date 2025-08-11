"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [role, setRole] = useState<"owner" | "tenant">("owner");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // (Maquette) Redirection simple selon le rôle
    const target = role === "owner" ? "/proprietaire/dashboard" : "/locataire/dashboard";
    router.push(target);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-800">Email</label>
        <input
          type="email"
          required
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
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
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
              role === "owner" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "hover:bg-gray-50"
            }`}
          >
            Propriétaire
          </button>
          <button
            type="button"
            onClick={() => setRole("tenant")}
            className={`rounded-lg border px-3 py-2 text-sm ${
              role === "tenant" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "hover:bg-gray-50"
            }`}
          >
            Locataire
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Pas de compte ?{" "}
        <a href="/proprietaire/inscription" className="text-indigo-600 hover:underline">Créer un compte propriétaire</a>
        {" · "}
        <a href="/locataire/inscription" className="text-indigo-600 hover:underline">Créer un compte locataire</a>
      </p>
    </form>
  );
}
