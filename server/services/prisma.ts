import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let prismaInstance: PrismaClient | null = null;
let prismaDisabled = false;

export function getPrisma(): PrismaClient | null {
  if (prismaDisabled) return null;
  if (prismaInstance) return prismaInstance;

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString || connectionString.trim() === '') {
    return null;
  }

  try {
    const isCloud =
      connectionString.includes('neon.tech') ||
      connectionString.includes('supabase.co') ||
      connectionString.includes('sslmode=require');

    const pool = new pg.Pool({
      connectionString,
      ssl: isCloud ? { rejectUnauthorized: false } : undefined,
      connectionTimeoutMillis: 4000,
    });
    const adapter = new PrismaPg(pool);

    prismaInstance = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });

    return prismaInstance;
  } catch (error) {
    console.warn('Falha ao conectar no PostgreSQL via Prisma:', error);
    prismaDisabled = true;
    return null;
  }
}

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    const client = getPrisma();
    if (!client) {
      throw new Error('PostgreSQL / Prisma não está conectado.');
    }
    return Reflect.get(client, prop, receiver);
  },
});

export default prisma;
