// app/(default)/annonces/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import ListingCard from "@/components/ListingCard";

export default async function AnnoncePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params; // ✅ on attend la promesse

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!listing) {
    return <div className="p-10 text-center text-gray-500">Annonce introuvable.</div>;
  }

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
      <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
      <p className="mt-2 text-gray-600">{listing.city} – {listing.type}</p>

      <div className="mt-6 aspect-[4/3] w-full bg-gray-100 rounded-xl overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {listing.images?.[0] ? (
          <img
            src={listing.images[0].url}
            alt={listing.images[0].alt ?? listing.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-gray-400">Aucune image</div>
        )}
      </div>

      <div className="mt-6 text-lg">
        {listing.description}
      </div>

      <div className="mt-6 flex justify-between text-gray-800 font-medium">
        <span>Loyer : {listing.rent} € + {listing.charges} € charges</span>
        <span>{listing.surface} m² – {listing.bedrooms} chambres</span>
      </div>
    </main>
  );
}
