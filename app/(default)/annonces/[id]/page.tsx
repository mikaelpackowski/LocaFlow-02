import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Listing = {
  id: string;
  title: string;
  city: string;
  type: string;
  rent: number;
  charges: number;
  bedrooms: number;
  surface: number;
  furnished: boolean;
  description: string;
  images?: { url: string; alt?: string }[];
};

export default async function AnnonceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { images: true },
  });

  if (!listing) return notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
      {/* Titre + Prix */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
        <p className="mt-2 text-lg text-gray-600">
          {listing.city} • {listing.type}
        </p>
        <div className="mt-3 text-2xl font-semibold text-indigo-600">
          {listing.rent.toLocaleString("fr-FR")} €
          <span className="text-gray-500 text-base"> +{listing.charges} € charges</span>
        </div>
      </div>

      {/* Image principale */}
      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {listing.images?.[0]?.url ? (
          <img
            src={listing.images[0].url}
            alt={listing.images[0]?.alt || listing.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-gray-400">
            Pas d’image
          </div>
        )}
      </div>

      {/* Détails */}
      <div className="mt-6 grid grid-cols-2 gap-6 text-gray-700">
        <div>
          <p>
            <span className="font-semibold">Surface :</span> {listing.surface} m²
          </p>
          <p>
            <span className="font-semibold">Chambres :</span> {listing.bedrooms}
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Meublé :</span>{" "}
            {listing.furnished ? "Oui" : "Non"}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
        <p className="text-gray-600 whitespace-pre-line">
          {listing.description}
        </p>
      </div>
    </main>
  );
}
