import { Prisma, PrismaClient } from '@prisma/client';
import { serverEnv } from '../env/serverEnv';

declare const global: typeof globalThis & {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, true>;
};

let prisma: typeof global.prisma;
const prismaOptions: Prisma.PrismaClientOptions = { rejectOnNotFound: true };

if (serverEnv.nodeEnv == 'production') {
  prisma = new PrismaClient(prismaOptions);
} else {
  if (!global.prisma) global.prisma = new PrismaClient(prismaOptions);
  prisma = global.prisma;
}

export { prisma };
