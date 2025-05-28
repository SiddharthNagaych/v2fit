// /app/api/user/purchase-status/route.ts
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma"; // adjust to your prisma client path
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      purchases: {
        include: {
          program: true,
        },
      },
      payments: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.purchases.length === 0) {
    return NextResponse.json({ hasPurchased: false });
  }

  return NextResponse.json({
    hasPurchased: true,
    purchases: user.purchases,
    payments: user.payments,
  });
}
