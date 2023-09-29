import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

type PrismaInstance = PrismaClient<
  Prisma.PrismaClientOptions,
  never,
  DefaultArgs
>;

export class DbConnector {
  private static instance: PrismaInstance | undefined;

  constructor() {
    if (!DbConnector.instance) {
      DbConnector.instance = new PrismaClient();
    }
    return DbConnector.instance;
  }
}

export const prisma = new DbConnector() as PrismaInstance;
