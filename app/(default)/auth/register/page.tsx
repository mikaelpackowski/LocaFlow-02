import { Suspense } from "react";
import RegisterForm from "./RegisterForm";

export const metadata = {
  title: "Créer un compte | ForGesty",
  description: "Inscription rapide puis paiement sécurisé.",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-lg px-4 sm:px-6 py-14">
      <h1 className="text-2xl font-bold text-gray-900 text-center">Créer un compte</h1>
      <p className="mt-2 text-center text-gray-600">
        Renseignez vos informations pour activer votre abonnement.
      </p>

      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        {/* Suspense requis car le formulaire utilise useSearchParams() en client */}
        <Suspense fallback={<div className="text-gray-500">Chargement…</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </main>
  );
}
