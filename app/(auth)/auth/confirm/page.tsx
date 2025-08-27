"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[60vh] grid place-items-center text-sm text-gray-500">
          Validation en cours…
        </main>
      }
    >
      <ConfirmInner />
    </Suspense>
  );
}

function ConfirmInner() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const sp = useSearchParams();

  const next = sp.get("next") || "/proprietaire/dashboard";
  const role = sp.get("role") || "";
  const plan = sp.get("plan") || "";
  const trial = sp.get("trial") || "";

  // Nouveau format Supabase (query params) possibles :
  const token_hash = sp.get("token_hash");
  const type = (sp.get("type") || "") as
    | "signup"
    | "magiclink"
    | "recovery"
    | "email_change"
    | "";
  const email = sp.get("email") || "";

  const [msg, setMsg] = useState("Validation en cours…");

  useEffect(() => {
    let ran = false;

    (async () => {
      if (ran) return;
      ran = true;

      // CAS A — Nouveau format: verifyOtp(token_hash + type [+ email])
      if (token_hash && type) {
        const { data, error } = await supabase.auth.verifyOtp({
          type,
          token_hash,
          // Supabase demande parfois l'email pour 'signup' / 'recovery'
          email: email || undefined,
        });

        if (error) {
          setMsg("Lien invalide ou expiré.");
          return;
        }

        // data.session peut être null selon le type ; on tente un échange si besoin
        if (!data.session) {
          const tryEx = await supabase.auth.exchangeCodeForSession(
            window.location.href
          );
          if (tryEx.error) {
            // Si on arrive ici: session non créée. On redirige vers la connexion.
            router.replace(`/auth/login?next=${encodeURIComponent(next)}`);
            return;
          }
        }

        await afterConfirmed({ supabase, router, role, plan, trial, next });
        return;
      }

      // CAS B — Ancien format: tokens dans le hash (#access_token=…)
      const hash = window.location.hash ?? "";
      const hasTokens =
        hash.includes("access_token=") ||
        hash.includes("refresh_token=") ||
        hash.includes("code=");

      if (hasTokens) {
        // Dans ta version des helpers, un string est attendu (l’URL complète ou le hash).
        let { error } = await supabase.auth.exchangeCodeForSession(
          hash ? hash : window.location.href
        );

        if (error && hash) {
          // Fallback setSession manuel
          const p = new URLSearchParams(hash.slice(1));
          const access_token = p.get("access_token");
          const refresh_token = p.get("refresh_token");
          if (access_token && refresh_token) {
            const res = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            error = res.error ?? null;
          }
        }

        if (error) {
          setMsg("Lien invalide ou expiré.");
          return;
        }

        // Nettoyer le hash dans l’URL
        history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );

        await afterConfirmed({ supabase, router, role, plan, trial, next });
        return;
      }

      // CAS C — Rien d’exploitable dans l’URL
      setMsg("Lien invalide ou expiré.");
    })();
  }, [supabase, router, role, plan, trial, next, token_hash, type, email]);

  return (
    <main className="min-h-[60vh] grid place-items-center">
      <p className="text-gray-700">{msg}</p>
    </main>
  );
}

async function afterConfirmed({
  supabase,
  router,
  role,
  plan,
  trial,
  next,
}: {
  supabase: ReturnType<typeof createClientComponentClient>;
  router: ReturnType<typeof useRouter>;
  role: string;
  plan: string;
  trial: string;
  next: string;
}) {
  // Onboarding propriétaire si demandé
  if (role === "owner" && plan) {
    const { data: s } = await supabase.auth.getSession();
    const token = s.session?.access_token ?? null;

    const r = await fetch("/api/onboarding/owner", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ plan, trial }),
    });

    if (!r.ok) {
      // Si l'onboarding échoue, on renvoie vers le tableau de bord quand même.
      // (Tu peux afficher un message si tu préfères)
    }
  }

  const profileStep =
    role === "owner"
      ? "/onboarding/proprietaire"
      : role === "tenant"
      ? "/onboarding/locataire"
      : null;

  // Redirection finale
  router.replace(profileStep || next);
}
