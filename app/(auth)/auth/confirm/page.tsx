"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [msg, setMsg] = useState("Validation en cours…");

  useEffect(() => {
    (async () => {
      // 1) Échange du code → session
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      if (error) {
        setMsg("Lien invalide ou expiré.");
        return;
      }

      // 2) Récupérer l’utilisateur + user_metadata
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      const meta = (user?.user_metadata ?? {}) as Record<string, any>;

      const intendedRole = meta.intended_role as string | undefined;
      const intendedPlan = meta.intended_plan as string | undefined;
      const intendedTrial = meta.intended_trial as string | undefined;
      const intendedNext = (meta.intended_next as string | undefined) || "/";

      // 3) Onboarding auto pour propriétaire si demandé
      if (intendedRole === "owner" && intendedPlan) {
        const { data: sess } = await supabase.auth.getSession();
        const token = sess.session?.access_token ?? null;

        const r = await fetch("/api/onboarding/owner", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ plan: intendedPlan, trial: intendedTrial }),
        });

        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          setMsg(j?.error || "Erreur d’onboarding.");
          return;
        }
      }

      // 4) (optionnel) Nettoyer les metadata temporaires
      try {
        await supabase.auth.updateUser({
          data: {
            intended_role: null,
            intended_plan: null,
            intended_trial: null,
            intended_next: null,
          },
        });
      } catch {
        /* non bloquant */
      }

      // 5) Redirection finale
      router.replace(intendedNext);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-[60vh] grid place-items-center">
      <p className="text-gray-700">{msg}</p>
    </main>
  );
}
