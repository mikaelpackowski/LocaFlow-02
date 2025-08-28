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

  // Parcours (facultatif)
  const next = sp.get("next") || "/dashboard/proprietaire";
  const role = sp.get("role") || "";
  const plan = sp.get("plan") || "";
  const trial = sp.get("trial") || "";

  // Params de confirmation
  const type = (sp.get("type") || "signup") as
    | "signup"
    | "magiclink"
    | "recovery"
    | "email_change";
  const email = sp.get("email") || "";
  const token_hash = sp.get("token_hash") || "";

  // Fallback éventuel si Supabase envoie ?code=… ou #access_token=…
  const hasCodeOrToken =
    typeof window !== "undefined" &&
    (new URL(window.location.href).searchParams.has("code") ||
      window.location.hash.includes("access_token="));

  const [msg, setMsg] = useState("Validation en cours…");
  const [details, setDetails] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // 1) Flux recommandé: token_hash (depuis email template)
        if (token_hash) {
          // Essai 1: avec email
          let { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
            email: email || undefined,
          });

          // Essai 2: sans email (certaines versions n'en ont pas besoin)
          if (error) {
            const try2 = await supabase.auth.verifyOtp({
              type,
              token_hash,
            });
            error = try2.error ?? null;

            if (error) {
              setMsg("Lien invalide ou expiré.");
              setDetails(error.message || JSON.stringify(error));
              return;
            }
          }
        }
        // 2) Fallback: lien avec ?code=… ou #access_token=…
        else if (hasCodeOrToken) {
          const { error } = await supabase.auth.exchangeCodeForSession(
            window.location.href
          );
          if (error) {
            setMsg("Lien invalide ou expiré.");
            setDetails(error.message || JSON.stringify(error));
            return;
          }
        } else {
          setMsg("Lien invalide ou expiré.");
          setDetails("Aucun token_hash / code / access_token détecté dans l’URL.");
          return;
        }

        // 3) Onboarding propriétaire si demandé
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
            setMsg("Erreur d’onboarding.");
            setDetails(j?.error || `HTTP ${r.status}`);
            return;
          }
        }

        // 4) Redirection finale
        const profileStep =
          role === "owner"
            ? "/onboarding/proprietaire"
            : role === "tenant"
            ? "/onboarding/locataire"
            : null;

        router.replace(profileStep || next);
      } catch (e: any) {
        setMsg("Lien invalide ou expiré.");
        setDetails(e?.message || String(e));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token_hash, email, type, hasCodeOrToken, role, plan, trial, next]);

  return (
    <main className="min-h-[60vh] grid place-items-center text-center px-4">
      <div>
        <p className="text-gray-800">{msg}</p>
        {details && (
          <p className="mt-2 text-xs text-gray-500 break-all">
            Détails : {details}
          </p>
        )}
      </div>
    </main>
  );
}
