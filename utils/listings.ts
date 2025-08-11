// utils/listings.ts

export type Listing = {
  id: string;
  slug: string;
  title: string;
  city: string;
  district?: string;
  surface: number;
  price: number;
  type: "appartement" | "maison" | "studio";
  images: string[];
  features: string[];
  description: string;
};

export const LISTINGS: Listing[] = [
  {
    id: "1",
    slug: "appartement-lumineux-paris-11",
    title: "Appartement lumineux – Paris 11",
    city: "Paris",
    district: "11e",
    surface: 48,
    price: 1450,
    type: "appartement",
    // ✅ images locales déjà présentes dans /public/images
    images: ["/images/hero-header.jpg", "/images/testimonial-01.jpg", "/images/testimonial-02.jpg"],
    features: ["Ascenseur", "Balcon", "Proche métro"],
    description:
      "Charmant 2 pièces au cœur du 11e, proche commerces et transports. Idéal jeune couple ou télétravail.",
  },
  {
    id: "2",
    slug: "studio-renove-lyon-2",
    title: "Studio rénové – Lyon 2",
    city: "Lyon",
    district: "2e",
    surface: 24,
    price: 690,
    type: "studio",
    images: ["/images/testimonial-03.jpg", "/images/testimonial-04.jpg", "/images/testimonial-05.jpg"],
    features: ["Cuisine équipée", "Douche italienne"],
    description:
      "Studio entièrement rénové, lumineux et calme. Immeuble sécurisé, proche Bellecour.",
  },
  {
    id: "3",
    slug: "maison-familiale-bordeaux",
    title: "Maison familiale – Bordeaux",
    city: "Bordeaux",
    surface: 120,
    price: 1950,
    type: "maison",
    images: ["/images/testimonial-06.jpg", "/images/testimonial-07.jpg", "/images/testimonial-08.jpg"],
    features: ["Jardin", "Garage", "4 chambres"],
    description:
      "Belle maison familiale avec jardin clos, à 10 min du centre. Écoles et commerces à proximité.",
  },
  {
    id: "4",
    slug: "appartement-terrasse-montpellier",
    title: "Appartement avec terrasse – Montpellier",
    city: "Montpellier",
    surface: 62,
    price: 990,
    type: "appartement",
    images: ["/images/testimonial-09.jpg", "/images/testimonial-02.jpg", "/images/testimonial-03.jpg"],
    features: ["Terrasse", "Climatisation"],
    description:
      "T3 avec grande terrasse exposée sud, résidence récente et calme. Tram à 5 minutes.",
  },
  {
    id: "5",
    slug: "studio-etudiant-lille",
    title: "Studio étudiant – Lille",
    city: "Lille",
    surface: 19,
    price: 540,
    type: "studio",
    images: ["/images/testimonial-04.jpg", "/images/testimonial-05.jpg", "/images/testimonial-06.jpg"],
    features: ["Meublé", "Proche université"],
    description:
      "Studio fonctionnel et meublé, idéal étudiant. Charges maîtrisées, Internet inclus.",
  },
  {
    id: "6",
    slug: "maison-contemporaine-nantes",
    title: "Maison contemporaine – Nantes",
    city: "Nantes",
    surface: 135,
    price: 2100,
    type: "maison",
    images: ["/images/testimonial-07.jpg", "/images/testimonial-08.jpg", "/images/testimonial-09.jpg"],
    features: ["Suite parentale", "Cuisine ouverte", "Jardin"],
    description:
      "Maison contemporaine lumineuse, belles prestations, quartier résidentiel recherché.",
  },
];

export function getBySlug(slug: string) {
  return LISTINGS.find((l) => l.slug === slug);
}
