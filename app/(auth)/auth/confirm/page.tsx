"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const ONBOARDING_KEY = "fg_onboarding";

export default function ConfirmPage() {
  return (
    <Suspense fallback={<Screen msg="Validation en cours…" />}>
      <ConfirmInner />
    </Suspense>
  );
}

function Screen({ msg }: { msg: string }) {
  return (
    <main className="min-h-[60vh] grid place-items-center">
      <p className="text-gray-700">{msg}</p>
    </main>
  );
}

function ConfirmInner() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const sp = useSearchParams();

  // URL (rarement présents avec PKCE)
  let next = sp.get("next") || "";
  let role = sp.get("role") || "";
  let plan = sp.get("plan") || "";
  let trial = sp.get("trial") || "";

  // Si manquants, on relit ce qu’on a stocké au signup
  if (!role || !plan || !next) {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(ONBOARDING_KEY) : null;
      if (raw) {
        const saved = JSON.parse(raw);
        next = next || saved?.next || "/";
        role = role || saved?.role || "";
        plan = plan || saved?.plan || "";
        trial = trial || "";
      }
    } catch {}
  }
  next = next || "/";

  const tokenHash = sp.get("token_hash");
  const type = (sp.get("type") || "").toLowerCase();
  const email = sp.get("email") || "";
  const code = sp.get("code");

  const [msg, setMsg] = useState("Validation en cours…");

 useEffect(() => {
  (async () => {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    // 1) Vérifier si Supabase a envoyé un token_hash
    const tokenHash = params.get("token_hash");
    const type = params.get("type"); // "signup", "magiclink", etc.

    let error = null;

    if (tokenHash) {
      // ⚡ Nouveau : échanger via verifyOtp quand on reçoit un token_hash
      const { data, error: err } = await supabase.auth.verifyOtp({
        type: type as "signup" | "magiclink" | "recovery",
        token_hash: tokenHash,
      });
      error = err;
    } else {
      // Cas PKCE classique (code dans URL)
      const { error: err } = await supabase.auth.exchangeCodeForSession(url.href);
      error = err;
    }

    if (error) {
      setMsg("Lien invalide ou expiré.");
      return;
    }

    // 2) Si ok, déclencher onboarding si propriétaire
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

    // 3) Redirection finale
    const profileStep =
      role === "owner" ? "/onboarding/proprietaire" :
      role === "tenant" ? "/onboarding/locataire" :
      null;

    router.replace(profileStep || next);
  })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [supabase, role, plan, trial, next]);

