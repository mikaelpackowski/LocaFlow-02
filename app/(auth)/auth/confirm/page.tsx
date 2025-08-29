// app/(auth)/auth/confirm/page.tsx
"use client";

import { Suspense, useEffect, useRef, useState } from "react";
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

  const next  = sp.get("next")  || "/dashboard/proprietaire";
  const role  = sp.get("role")  || "";
  const plan  = sp.get("plan")  || "";
  const trial = sp.get("trial") || "";

  const [msg, setMsg] = useState("Validation en cours…");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        // 1) Finaliser une éventuelle session côté client (si l'URL contient des preuves d'auth)
        const href = typeof window !== "undefined" ? window.location.href : "";
        if (href) {
          const url = new URL(href);
          const hasAuthArtifacts =
            url.searchParams.has("code") ||
            url.searchParams.has("token_hash") ||
            url.hash.includes("access_token");

          if (hasAuthArtifacts) {
            const { error } = await supabase.auth.exchangeCodeForSession(url.toString());
            if (error) {
              setMsg("Lien invalide ou expiré.");
              return;
            }
          }
        }

        // 2) Onboarding propriétaire (création / MAJ d'abonnement)
        if (role === "owner" && plan) {
          const { data } = await supabase.auth.getSession();
          const token = data.session?.access_token;

          const res = await fetch("/api/onboarding/owner", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ plan, trial }),
          });

          if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            setMsg(j?.error || "Erreur d’onboarding.");
            return;
          }
        }

        // 3) Redirection finale
        router.replace(next);
      } catch (e: any) {
        setMsg(e?.message || "Erreur inattendue.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, router, next, role, plan, trial]);

  return (
    <main className="min-h-[60vh] grid place-items-center">
      <p className="text-gray-700">{msg}</p>
    </main>
  );
}
