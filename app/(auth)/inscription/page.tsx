"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic"; // évite le prerender error avec searchParams

export default function InscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-sm text-gray-500">
          Chargement…
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const sp = useSearchParams();

  const plan = sp.get("plan");
  const role = sp.get("role");
  const trial = sp.get("trial");
  const returnTo = sp.get("returnTo") || "/annonces";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    // 1) Création du compte Supabase Auth
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMsg(error.message);
      return;
    }

    // 2) Récupérer le token de session côté client
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token ?? null;

    // 3) Onboarding propriétaire avec Bearer token (si rôle + plan fournis)
    if (role === "owner" && plan) {
      const r = await fetch("/api/onboarding/owner", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}), // 👈 IMPORTANT
        },
        body: JSON.stringify({ plan, trial }),
      });

      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setMsg(j?.error || "Erreur onboarding propriétaire");
        return;
      }
    }

    // 4) Redirection
    router.push(returnTo);
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Créer un compte</h1>

        {role === "owner" && plan && (
          <p className="text-xs text-gray-600 text-center">
            Vous avez choisi la formule <b>{plan}</b>
            {trial === "1m" ? " — essai 1 mois." : "."}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          S’inscrire
        </button>

        {msg && <p className="text-center text-sm text-red-600">{msg}</p>}
      </form>
    </main>
  );
}
