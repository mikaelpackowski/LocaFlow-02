import TenantIncidentForm from "@/components/forms/TenantIncidentForm";

export const metadata = {
  title: "Signaler un problème | LocaFlow",
  description: "Déclarer un incident dans le logement.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Signaler un problème</h1>
      <p className="mt-1 text-gray-600">Décrivez le souci rencontré dans votre logement.</p>
      <TenantIncidentForm />
    </main>
  );
}
