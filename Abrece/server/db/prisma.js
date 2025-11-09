import { PrismaClient } from "@prisma/client";

// evita recriar no hot-reload
export const prisma =
  globalThis.__prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}