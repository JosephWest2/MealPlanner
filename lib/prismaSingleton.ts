import { PrismaClient } from "@prisma/client";

const golbalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = golbalForPrisma.prisma || new PrismaClient({log: ["query"]});

if (process.env.NODE_ENV !== "production") {
    golbalForPrisma.prisma = prisma;
}