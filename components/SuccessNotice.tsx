"use client";

import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function SuccessNotice() {
  return (
    <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center shadow-sm">
      <div className="flex flex-col items-center gap-3">
        <CheckCircleIcon className="h-12 w-12 text-green-600" />
        <h2 className="text-lg font-semibold text-green-800">
          Paiement confirmé 🎉
        </h2>
        <p className="text-sm text-green-700">
          Merci ! Votre abonnement est actif. Vous pouvez maintenant profiter de
          toutes les fonctionnalités de ForGesty.
        </p>
        <Link
          href="/proprietaire/dashboard"
          className="mt-4 rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-500"
        >
          Aller au tableau de bord
        </Link>
      </div>
    </div>
  );
}
