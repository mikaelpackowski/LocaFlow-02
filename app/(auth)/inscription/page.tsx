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

  const plan = sp.get("plan");
  const role = sp.get("role");
  const trial = sp.get("trial");
  const returnTo = sp.get("returnTo") || "/dashboard/proprietaire";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      // URL de redirection utilisée par le lien de confirmation
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : "https://www.forgesty.com";

      const confirmUrl = `${origin}/auth/confirm?next=${encodeURIComponent(
        returnTo
      )}&role=${encodeURIComponent(role ?? "")}&plan=${encodeURIComponent(
        plan ?? ""
      )}&trial=${encodeURIComponent(trial ?? "")}`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: confirmUrl,
        },
      });

      if (error) {
        setMsg(error.message);
        return;
      }

      setMsg(
        "Un e-mail de confirmation vient de vous être envoyé. Cliquez sur le lien reçu pour continuer."
      );
      // Optionnel : router.push("/auth/check-email");
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
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Envoi…" : "S’inscrire"}
        </button>

        {msg && <p className="text-center text-sm text-gray-700">{msg}</p>}

        <p className="text-center text-sm text-gray-500">
          Déjà un compte ?{" "}
          <a
            className="text-indigo-600 underline"
            href={`/auth/login?next=${encodeURIComponent(returnTo)}`}
          >
            Se connecter
          </a>
        </p>
      </form>
    </main>
  );
}
