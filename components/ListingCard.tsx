// components/ListingCard.tsx
import Link from "next/link";
import {
  MapPinIcon,
  HomeIcon,
  CubeIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

type ListingCardProps = {
  id: string;
  title: string;
  city: string;
  type: string;
  rent: number;
  charges: number;
  bedrooms: number;
  surface: number;
  furnished: boolean;
  /** API shape */
  image?: string | null;
  /** DB shape */
  images?: { url: string; alt?: string | null }[];
};

export default function ListingCard(props: ListingCardProps) {
  const {
    id,
    title,
    city,
    type,
    rent,
    charges,
    bedrooms,
    surface,
    furnished,
    image,
    images,
  } = props;

  const cover =
    image ??
    images?.[0]?.url ??
    "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop"; // fallback clean

  const total = rent + (Number.isFinite(charges) ? charges : 0);

  return (
    <Link
      href={`/annonces/${id}`}
      className="group block overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
        {/* Gradient + badges */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-black/0" />
        <div className="absolute left-3 top-3 flex gap-2">
          {furnished && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-violet-700 ring-1 ring-violet-200">
              Meublé
            </span>
          )}
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
            {type}
          </span>
        </div>
        {/* Price tag */}
        <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-sm font-semibold text-gray-900 ring-1 ring-gray-200">
          <span className="inline-flex items-center gap-1.5">
            <BanknotesIcon className="h-4 w-4" />
            {total.toLocaleString("fr-FR")} €
            <span className="text-xs font-normal text-gray-500">
              /mois
            </span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="line-clamp-1 text-base font-semibold text-gray-900">
          {title}
        </h3>

        <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
          <MapPinIcon className="h-4 w-4" />
          <span className="line-clamp-1">{city}</span>
        </div>

        {/* Specs */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-700">
          <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1">
            <HomeIcon className="h-4 w-4" />
            <span>{bedrooms} ch</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1">
            <CubeIcon className="h-4 w-4" />
            <span>{surface} m²</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1">
            <BanknotesIcon className="h-4 w-4" />
            <span>
              {rent.toLocaleString("fr-FR")}€
              <span className="text-gray-500"> +{charges}€</span>
            </span>
          </div>
        </div>

        {/* CTA subtle */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">Référence: {id.slice(0, 6)}</span>
          <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
            Voir l’annonce →
          </span>
        </div>
      </div>
    </Link>
  );
}
