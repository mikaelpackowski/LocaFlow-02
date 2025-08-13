// app/(default)/auth/login/LoginForm.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const searchParams = useSearchParams();

  // rôle venu de l’URL ?role=owner|tenant
  const roleFromURL = (searchParams?.get("role") ?? "").toLowerCase();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"owner" | "tenant">(
    roleFromURL === "tenant" ? "tenant" : "owner"
  );

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    if (roleFromURL === "owner" || roleFromURL === "tenant") {
      setRole(roleFromURL as "owner" | "tenant");
    }
  }, [roleFromURL]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrMsg(null);
    setLoading(true);

    // Destination après login
    const callbackUrl =
      role === "owner" ? "/proprietaire/dashboard" : "/locataire/dashboard";

    // ✅ on laisse NextAuth rediriger → les Server Components (Header) se re-rendent
    const res = await signIn("credentials", {
      email,
      password,
      role,
      callbackUrl,
      redirect: true, // IMPORTANT
    });

    setLoading(false);

    // Si NextAuth renvoie une erreur (ex: CredentialsSignin)
    if (res && (res as any).error) {
      setErrMsg((res as any).error === "CredentialsSignin"
        ? "Identifiants invalides."
        : (res as any).error);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {errMsg && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errMsg}
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-800">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
          placeholder="vous@exemple.com"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-gray-800">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border px-3 py-2"
          placeholder="••••••••"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-800">Je suis</label>
        <div className="grid grid-cols-2 gap-2">
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

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>

      <div className="text-center text-sm text-gray-600">
        Pas de compte ?{" "}
        <a href="/proprietaire/inscription" className="font-medium text-indigo-600 hover:underline">
          Créer un compte propriétaire
        </a>{" "}
        ·{" "}
        <a href="/locataire/inscription" className="font-medium text-indigo-600 hover:underline">
          Créer un compte locataire
        </a>
      </div>
    </form>
  );
}
