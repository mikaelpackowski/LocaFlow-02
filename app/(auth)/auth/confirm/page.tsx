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

  // paramètres « parcours », optionnels
  const next = sp.get("next") || "/dashboard/proprietaire";
  const role = sp.get("role") || "";
  const plan = sp.get("plan") || "";
  const trial = sp.get("trial") || "";

  // paramètres de vérification
  const type = (sp.get("type") || "signup") as
    | "signup"
    | "magiclink"
    | "recovery"
    | "email_change";
  const email = sp.get("email") || "";
  const token_hash = sp.get("token_hash") || "";

  // éventuellement présents selon d’autres flux (oauth/pkce)
  const hasCodeOrToken =
    typeof window !== "undefined" &&
    (new URL(window.location.href).searchParams.has("code") ||
      window.location.hash.includes("access_token="));

  const [msg, setMsg] = useState("Validation en cours…");

  useEffect(() => {
    (async () => {
      try {
        // Cas 1 : on a un token_hash => vérifier explicitement l’OTP (recommandé pour email)
        if (token_hash && email) {
          const { data, error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
            email,
          });
          if (error) {
            setMsg("Lien invalide ou expiré.");
            return;
          }
        }
        // Cas 2 : fallback si on arrive via un flux qui fournit ?code= ou #access_token
        else if (hasCodeOrToken) {
          const { error } = await supabase.auth.exchangeCodeForSession(
            new URL(window.location.href)
          );
          if (error) {
            setMsg("Lien invalide ou expiré.");
            return;
          }
        } else {
          setMsg("Lien invalide ou expiré.");
          return;
        }

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
            const j = await r.json().catch(() => ({}));
            setMsg(j?.error || "Erreur d’onboarding.");
            return;
          }
        }

        // Redirection finale
        const profileStep =
          role === "owner"
            ? "/onboarding/proprietaire"
            : role === "tenant"
            ? "/onboarding/locataire"
            : null;

        router.replace(profileStep || next);
      } catch {
        setMsg("Lien invalide ou expiré.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token_hash, email, type, hasCodeOrToken, role, plan, trial, next]);

  return (
    <main className="min-h-[60vh] grid place-items-center">
      <p className="text-gray-700">{msg}</p>
    </main>
  );
}
