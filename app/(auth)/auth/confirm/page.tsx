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
