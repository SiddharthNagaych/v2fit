import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      cart: {
        include: {
          items: {
            include: {
              product: true // include full product info
            }
          }
        }
      }
    }
  });

  const cart = user?.cart;
  if (!user || !user.cart) {
  return NextResponse.json({
    items: [],
    totalItems: 0,
    totalAmount: 0,
    appliedPromo: null,
    discountAmount: 0
  });
}

  return NextResponse.json({
    items: cart?.items || [],
    totalItems: cart?.totalItems || 0,
    totalAmount: cart?.totalAmount || 0,
    appliedPromo: cart?.appliedPromo || null,
    discountAmount: cart?.discountAmount || 0
  });
}
