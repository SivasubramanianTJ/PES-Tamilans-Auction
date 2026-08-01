import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

prisma
  .$connect()
  .then(() => {
    console.log("✅ Prisma connected successfully");
  })
  .catch((err) => {
    console.error("❌ Prisma connection failed:");
    console.error(err);
    process.exit(1);
  });