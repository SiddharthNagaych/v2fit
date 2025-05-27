import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {


  // Seed Razorpay Test User
  const razorpayPassword = "razorpay@#$";
  const hashedRazorpayPassword = await bcrypt.hash(razorpayPassword, 12);

  const razorpayUser = await prisma.user.upsert({
    where: { email: "razorpay@gmail.com" },
    update: {
      password: hashedRazorpayPassword,
    },
    create: {
      name: "Razorpay Test User",
      email: "razorpay@gmail.com",
      emailVerified: new Date(),
      password: hashedRazorpayPassword,
      role: "USER",
    },
  });

  console.log("Seeded users:");
 
  console.log("Razorpay User:", razorpayUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
