import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/forms_clientes';

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
function createPrismaClient(): PrismaClient {
  const connectionString =
    process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/forms_clientes';

  try {
    const pool = new pg.Pool({
      connectionString,
      ssl: connectionString.includes('neon.tech') || connectionString.includes('supabase.co') || connectionString.includes('sslmode=require')
        ? { rejectUnauthorized: false }
        : undefined,
    });
    const adapter = new PrismaPg(pool);

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  } catch (error) {
    console.error('Erro ao instanciar Prisma Client:', error);
    return new PrismaClient();
  }
}

export const prisma = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
