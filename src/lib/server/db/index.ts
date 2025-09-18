// src/lib/server/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Only load dotenv in non-SvelteKit environments
// (when process.env.DATABASE_URL isn’t already injected by Vite/SvelteKit)
if (!process.env.DATABASE_URL) {
  await import('dotenv/config');
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const client = postgres(process.env.DATABASE_URL);

export const db = drizzle(client, { schema });
