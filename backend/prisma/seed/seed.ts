import bcrypt from "bcrypt";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const username = "superadmin";
  const password = "Admin@123";

  const existing = await prisma.user.findUnique({
    where: { username },
  });

  if (existing) {
    console.log("✅ Super Admin already exists.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      fullName: "Super Admin",
      username,
      passwordHash,
      role: UserRole.SUPER_ADMIN,
    },
  });

  console.log("✅ Super Admin created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });