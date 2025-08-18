// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const owner = await prisma.user.upsert({
    where: { email: "owner@test.com" },
    update: {},
    create: { email: "owner@test.com", name: "Propriétaire Démo", role: "owner" },
  });

  const base = {
    ownerId: owner.id,
    description: "Bel appartement lumineux, proche commodités.",
    leaseType: "VIDE",
    furnished: false,
    status: "PUBLISHED",
    availableAt: new Date(),
  };

  await prisma.listing.create({
    data: {
      title: "T2 lumineux – Nation",
      type: "APPARTEMENT",
      city: "Paris",
      rent: 1200,
      charges: 100,
      bedrooms: 1,
      surface: 42,
      ...base,
      images: { create: [{ url: "https://picsum.photos/seed/apt1/800/600", alt: "Séjour" }] },
    },
  });

  await prisma.listing.create({
    data: {
      title: "Studio meublé – Croix-Rousse",
      type: "STUDIO",
      leaseType: "MEUBLE",
      city: "Lyon",
      rent: 690,
      charges: 60,
      bedrooms: 0,
      surface: 22,
      furnished: true,
      ...base,
      images: { create: [{ url: "https://picsum.photos/seed/apt2/800/600", alt: "Pièce de vie" }] },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
