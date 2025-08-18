import Link from "next/link";

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
  images?: { url: string }[];
};

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/annonces/${listing.id}`}
      className="group block rounded-2xl border bg-white shadow-sm overflow-hidden hover:shadow-md transition"
    >
      <div className="aspect-[4/3] w-full bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {listing.images?.[0]?.url ? (
          <img
            src={listing.images[0].url}
            alt={listing.title}
            className="h-full w-full object-cover group-hover:scale-[1.02] transition"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-gray-400 text-sm">
            Aperçu
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 line-clamp-1">
            {listing.title}
          </h3>
          {listing.furnished && (
            <span className="ml-2 rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700">
              Meublé
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-600">
          {listing.city} • {listing.type}
        </p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <div className="font-semibold text-gray-900">
            {listing.rent.toLocaleString("fr-FR")} €
            <span className="text-gray-500 text-xs"> +{listing.charges}€</span>
          </div>
          <div className="text-gray-600">
            {listing.surface} m² • {listing.bedrooms} ch
          </div>
        </div>
      </div>
    </Link>
  );
}
