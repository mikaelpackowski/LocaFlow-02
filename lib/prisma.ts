// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // Evite de recréer le client en dev (hot reload)
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    // log: ["query", "error", "warn"], // décommente si besoin de debug
  });

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;
