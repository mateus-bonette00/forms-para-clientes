import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let prismaInstance: PrismaClient | null = null;

export function getPrisma(): PrismaClient {
  if (prismaInstance) {
    return prismaInstance;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.warn('⚠️ DATABASE_URL não definida nas variáveis de ambiente.');
    prismaInstance = new PrismaClient();
    return prismaInstance;
  }

  try {
    const isCloud =
      connectionString.includes('neon.tech') ||
      connectionString.includes('supabase.co') ||
      connectionString.includes('sslmode=require');

    const pool = new pg.Pool({
      connectionString,
      ssl: isCloud ? { rejectUnauthorized: false } : undefined,
      connectionTimeoutMillis: 5000,
    });
    const adapter = new PrismaPg(pool);

    prismaInstance = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });

    return prismaInstance;
  } catch (error) {
    console.error('Falha ao conectar no PostgreSQL via Prisma:', error);
    prismaInstance = new PrismaClient();
    return prismaInstance;
  }
}

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    const client = getPrisma();
    return Reflect.get(client, prop, receiver);
  },
});

export default prisma;
