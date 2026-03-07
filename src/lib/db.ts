import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    // Prisma 7 requires datasourceUrl but removed it from the TypeScript types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalForPrisma.prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    } as any);
  }
  return globalForPrisma.prisma;
}
