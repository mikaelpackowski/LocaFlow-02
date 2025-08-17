// app/(default)/auth/register/page.tsx
import RegisterForm from "./RegisterForm";

export const metadata = {
  title: "Créer un compte | ForGesty",
  description: "Renseignez vos informations pour activer votre abonnement.",
};

export default function RegisterPage({
  searchParams,
}: {
  // Next 15: ici on peut garder un objet simple, pas besoin d'async
  searchParams?: { plan?: string };
}) {
  const planFromUrl =
    typeof searchParams?.plan === "string" ? searchParams.plan : "";

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 pt-28 pb-16">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Créer un compte
        </h1>
        <p className="mt-2 text-gray-600">
          Renseignez vos informations pour activer votre abonnement.
        </p>
      </header>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <RegisterForm defaultPlan={planFromUrl} />
      </div>
    </main>
  );
}
