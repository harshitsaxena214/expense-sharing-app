// For Local Development with PostgreSQL use the commented code.

// import { PrismaClient } from "../generated/prisma/client.js";
// import { PrismaPg } from "@prisma/adapter-pg";
// import "dotenv/config";

declare global {
  var prisma: PrismaClient | undefined;
}

// const connectionString = `${process.env.DATABASE_URL}`;
// if (!connectionString) {
//   throw new Error("DATABASE_URL is not set. Check your Environment Variables.");
// }
// const adapter = new PrismaPg({ connectionString });
// const globalForPrisma = globalThis;
// const db = globalForPrisma.prisma ?? new PrismaClient({ adapter });
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
// export default db;

import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import "dotenv/config";

neonConfig.webSocketConstructor = ws;

const connectionString = `${process.env.DATABASE_URL}`;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Check your Environment Variables.");
}

const adapter = new PrismaNeon({ connectionString });

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
