import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService {
  private _db: ReturnType<typeof createPrismaClient>;

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    this._db = createPrismaClient(adapter);
  }

  async onModuleInit() {
    await this._db.$connect();
  }

  get db() {
    return this._db;
  }
}

function createPrismaClient(adapter: PrismaPg) {
  const base = new PrismaClient({ adapter });
  return base.$extends({
    model: {
      client: {
        async softDelete<T>(
          this: T,
          args: { where: Prisma.Args<T, 'update'>['where'] },
        ) {
          const ctx = Prisma.getExtensionContext(this);
          return (ctx as any).update({
            where: args.where,
            data: { deletedAt: new Date() },
          });
        },
      },
    },
    query: {
      client: {
        async $allOperations({ operation, args, query }) {
          // omit deletedAt from all queries
          if (['findFirst', 'findUnique', 'findMany'].includes(operation)) {
            (args as any).omit = {
              ...((args as any).omit ?? {}),
              deletedAt: true,
            };
          }

          if (
            [
              'findFirst',
              'findUnique',
              'findMany',
              'update',
              'updateMany',
              'count',
            ].includes(operation)
          ) {
            (args as any).where = { ...(args as any).where, deletedAt: null };
          }
          return query(args);
        },
      },
    },
  });
}
