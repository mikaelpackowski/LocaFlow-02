// app/(auth)/auth/confirm/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
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

  const type        = sp.get("type");          // "signup" | "recovery" | etc.
  const emailParam  = sp.get("email") || "";   // requis pour verifyOtp (PKCE)
  const tokenHash   = sp.get("token_hash");    // PKCE flow
  const code        = sp.get("code");          // OAuth/code flow

  const [msg, setMsg] = useState("Validation en cours…");

  useEffect(() => {
    (async () => {
      // 1) Finaliser la session côté client
      let authErr: string | null = null;

      try {
        // ...
if (tokenHash) {
  // ✅ Cas email/PKCE (signup, recovery…)
  const { error } = await supabase.auth.verifyOtp({
    type: (type as any) || "signup", 
    token_hash: tokenHash,
  });
  if (error) authErr = error.message;
}

          });
          if (error) authErr = error.message;
        } else if (code || window.location.hash.includes("access_token")) {
          // ✅ Cas OAuth (code) ou hash access_token
          const { error } = await supabase.auth.exchangeCodeForSession(
            window.location.href
          );
          if (error) authErr = error.message;
        } else {
          authErr = "Session absente. Réessayez depuis l’e-mail de confirmation.";
        }
      } catch (e: any) {
        authErr = e?.message || "Erreur de confirmation.";
      }

      if (authErr) {
        setMsg(authErr);
        return;
      }

      // 2) Onboarding propriétaire (création/MAJ d’abonnement)
      try {
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
      } catch (e: any) {
        setMsg(e?.message || "Erreur d’onboarding.");
        return;
      }

      // 3) Redirection finale
      router.replace(next);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, next, role, plan, trial, tokenHash, emailParam, code, type]);

  return (
    <main className="min-h-[60vh] grid place-items-center">
      <p className="text-gray-700">{msg}</p>
    </main>
  );
}
