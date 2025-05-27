import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = "Sidyat1234@#"; // Replace this with your new password
  const hashedPassword = await bcrypt.hash(password, 12); // Hash the new password with bcrypt

  // Create the admin user with the hashed password
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" }, // Assuming you're updating this user's password
    update: {
      password: hashedPassword, // Update the password if user already exists
    },
    create: {
      name: "Admin User",
      email: "admin@example.com",
      emailVerified: new Date(),
      password: hashedPassword, // Set the new hashed password
      role: "ADMIN",
    },
  });

  console.log("Admin user has been seeded:", adminUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
