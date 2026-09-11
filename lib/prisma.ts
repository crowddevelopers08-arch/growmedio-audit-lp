import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

// One client per server process. In dev, Next re-evaluates modules on every
// edit, so the instance is parked on globalThis to avoid piling up pools.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  // DATABASE_URL is Neon's pooled connection string. A missing value fails on
  // the first query rather than at import, so `next build` works without it.
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
