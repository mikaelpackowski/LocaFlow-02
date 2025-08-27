"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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

  // On continue d’accepter un "next" facultatif pour la navigation locale (pas envoyé dans l’email)
  const next = sp.get("next") || "/dashboard/proprietaire";
  const role = sp.get("role") || "owner";        // ou tenant, selon le lien d’origine
  const plan = sp.get("plan") || "PRO";          // PRO / PREMIUM / …
  const trial = sp.get("trial") || "";           // "1m" si essai

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      // IMPORTANT: ne PAS mettre de query params ici.
      const origin =
        typeof window !== "undefined" ? window.location.origin : "https://www.forgesty.com";
      const confirmUrl = `${origin}/auth/confirm`;

      // On stocke les intentions dans le user_metadata
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: confirmUrl,
          data: {
            intended_role: role,
            intended_plan: plan,
            intended_trial: trial,
            intended_next: next, // pratique pour reprendre la navigation après
          },
        },
      });

      if (error) {
        setMsg(error.message);
        return;
      }

      setMsg(
        "Un e-mail de confirmation vous a été envoyé. Cliquez sur le lien pour valider votre compte."
      );
      // Astuce UX : on peut rediriger vers une page "check-email"
      // router.push("/auth/check-email");
    } catch (err: any) {
      setMsg(err?.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Créer un compte</h1>

        <p className="text-xs text-gray-600 text-center">
          Vous avez choisi la formule <b>{plan}</b>
          {trial === "1m" ? " — essai 1 mois." : "."}
        </p>

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
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Envoi…" : "S’inscrire"}
        </button>

        {msg && <p className="text-center text-sm text-gray-700">{msg}</p>}

        <p className="text-center text-sm text-gray-500">
          Déjà un compte ?{" "}
          <a className="text-indigo-600 underline" href={`/auth/login?next=${encodeURIComponent(next)}`}>
            Se connecter
          </a>
        </p>
      </form>
    </main>
  );
}
