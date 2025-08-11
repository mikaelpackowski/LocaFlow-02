// components/ListingCard.tsx
import Image from "next/image";
import Link from "next/link";

export default function ListingCard({ listing }: { listing: any }) {
  return (
    <article className="overflow-hidden rounded-2xl border shadow-sm hover:shadow-md transition">
      <Link href={`/annonces/${listing.slug}`} className="block">
        <div className="relative h-48 w-full">
          <Image
            src={listing.images?.[0] || "/images/hero-header.jpg"}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900">{listing.title}</h3>
          <p className="text-sm text-gray-600">
            {listing.city}{listing.district ? ` – ${listing.district}` : ""} · {listing.surface} m²
          </p>
          <p className="mt-1 font-semibold">
            {Number(listing.price).toLocaleString("fr-FR")} € / mois
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs">{listing.type}</span>
            {listing.features?.slice(0, 2).map((f: string) => (
              <span key={f} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs">{f}</span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
