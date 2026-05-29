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

const SOFT_DELETE_READ_OPS = ['findFirst', 'findUnique', 'findMany'];
const SOFT_DELETE_FILTER_OPS = [
  ...SOFT_DELETE_READ_OPS,
  'update',
  'updateMany',
  'count',
];

function softDeleteMethod<T>(
  this: T,
  args: { where: Prisma.Args<T, 'update'>['where'] },
) {
  const ctx = Prisma.getExtensionContext(this);
  return (ctx as any).update({
    where: args.where,
    data: { deletedAt: new Date() },
  });
}

function softDeleteQueryHandler({ operation, args, query }: any) {
  if (SOFT_DELETE_READ_OPS.includes(operation)) {
    args.omit = { ...args.omit, deletedAt: true };
  }
  if (SOFT_DELETE_FILTER_OPS.includes(operation)) {
    args.where = { ...args.where, deletedAt: null };
  }
  return query(args);
}

function createPrismaClient(adapter: PrismaPg) {
  const base = new PrismaClient({ adapter });
  return base.$extends({
    model: {
      client: { softDelete: softDeleteMethod },
      equipment: { softDelete: softDeleteMethod },
    },
    query: {
      client: { $allOperations: softDeleteQueryHandler },
      equipment: { $allOperations: softDeleteQueryHandler },
    },
  });
}
