import OwnerIncidentForm from "@/components/forms/OwnerIncidentForm";

export const metadata = {
  title: "Gérer un problème | LocaFlow",
  description: "Déclarer/traiter un incident côté propriétaire.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Gérer un problème</h1>
      <p className="mt-1 text-gray-600">Créez un ticket et assignez-le à un artisan si besoin.</p>
      <OwnerIncidentForm />
    </main>
  );
}
