// app/(default)/compte/abonnement/SuccessNotice.tsx
"use client";
import { useEffect, useState } from "react";

export default function SuccessNotice() {
  const [showRedirect, setShowRedirect] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setShowRedirect(true), 200);
    const t2 = setTimeout(() => (window.location.href = "/dashboard"), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">
      <div className="font-semibold text-green-800">Paiement confirmé 🎉</div>
      <div className="text-green-700">Merci ! Votre abonnement est actif (ou en cours d’activation).</div>
      {showRedirect && (
        <div className="mt-2 text-sm text-green-800/80">
          Redirection vers le tableau de bord…
        </div>
      )}
    </div>
  );
}
