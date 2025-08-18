// app/(default)/annonces/[id]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs"; // Prisma nécessite le runtime Node.js en prod

export default async function AnnonceDetailPage(
  props: { params: Promise<{ id: string }> } // Next 15: params est une Promise
) {
  const { id } = await props.params;

  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!listing) return notFound();

    return (
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-14">
        <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
        <p className="mt-2 text-gray-600">
          {listing.city} • {listing.type}
        </p>

        <div className="mt-6 aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {listing.images?.[0]?.url ? (
            <img
              src={listing.images[0].url}
              alt={listing.images[0]?.alt ?? listing.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-gray-400">
              Pas d’image
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6 text-gray-700">
          <div>
            <p><span className="font-semibold">Surface :</span> {listing.surface} m²</p>
            <p><span className="font-semibold">Chambres :</span> {listing.bedrooms}</p>
          </div>
          <div>
            <p><span className="font-semibold">Meublé :</span> {listing.furnished ? "Oui" : "Non"}</p>
            <p>
              <span className="font-semibold">Loyer :</span>{" "}
              {listing.rent.toLocaleString("fr-FR")} € + {listing.charges} €
            </p>
          </div>
        </div>

        {listing.description && (
          <div className="mt-8">
            <h2 className="mb-2 text-xl font-semibold text-gray-900">Description</h2>
            <p className="whitespace-pre-line text-gray-600">{listing.description}</p>
          </div>
        )}
      </main>
    );
  } catch {
    // Si la DB tombe/connexion coupée -> évite l'erreur “Application error” en prod
    return notFound();
  }
}
