// ...imports...
export default function InscriptionPage() {
  // ...
  const sp = useSearchParams();
  const plan = sp.get("plan");
  const role = sp.get("role");
  const trial = sp.get("trial"); // 👈 récupère '1m' si présent
  const returnTo = sp.get("returnTo") || "/annonces";

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return setMsg(error.message);

    if (role === "owner" && plan) {
      const r = await fetch("/api/onboarding/owner", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan, trial }), // 👈 on envoie trial
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setMsg(j?.error || "Erreur onboarding propriétaire");
        return;
      }
    }

    router.push(returnTo);
  }
  // ... le reste inchangé ...
}
