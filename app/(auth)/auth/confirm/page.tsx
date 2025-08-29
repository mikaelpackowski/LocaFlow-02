"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <main className="min-h-[60vh] grid place-items-center text-sm text-gray-500">
        Validation en cours…
      </main>
    }>
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

  const [msg, setMsg] = useState("Finalisation…");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        // Ici on N’ÉCHANGE PLUS le code : c’est déjà fait par /auth/callback
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setMsg("Session absente. Réessayez depuis l’e-mail de confirmation.");
          return;
        }

        // Onboarding propriétaire
        if (role === "owner" && plan) {
          const token = data.session.access_token;
          const res = await fetch("/api/onboarding/owner", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ plan, trial }),
          });

          if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            setMsg(j?.error || "Erreur d’onboarding.");
            return;
          }
        }

        router.replace(next);
      } catch (e: any) {
        setMsg(e?.message || "Erreur inattendue.");
      }
    })();
  }, [supabase, router, next, role, plan, trial]);

  return (
    <main className="min-h-[60vh] grid place-items-center">
      <p className="text-gray-700">{msg}</p>
    </main>
  );
}
