// app/api/cart/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '../../../../../auth';
import { z } from 'zod';
import { Prisma } from '@prisma/client';




const cartSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      price: z.number().positive(),
     originalPrice: z.number().positive().optional(),
      duration: z.string(),
      instructor: z.string(),
      image: z.string(),
      category: z.string(),
      quantity: z.number().int().positive()
    })
  ),
  totalItems: z.number().int().nonnegative(),
  totalAmount: z.number().nonnegative(),
  appliedPromo: z.string().nullable(),
  discountAmount: z.number().nonnegative()
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate input
    const parsed = cartSchema.safeParse(await req.json());
    if (!parsed.success) {
      console.error(parsed.error); // Log error details
      return NextResponse.json(
        { error: 'Invalid cart data', details: parsed.error },
        { status: 400 }
      );
    }

    const { items, totalItems, totalAmount, appliedPromo, discountAmount } = parsed.data;

    // Verify prices against product database
    const priceVerification = await verifyCartPrices(items);
    if (!priceVerification.valid) {
      return NextResponse.json(
        { 
          error: 'Price mismatch', 
          invalidItems: priceVerification.invalidItems 
        },
        { status: 400 }
      );
    }

    // Get or create user cart
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Upsert cart
    const cart = await prisma.cart.upsert({
      where: { userId: user.id },
      update: {
        totalItems,
        totalAmount,
        appliedPromo,
        discountAmount,
        updatedAt: new Date(),
        items: {
          deleteMany: {}, // clear previous items
          create: items.map((item) => ({
            productId: item.id, 
            quantity: item.quantity,
            price: item.price
          })) as Prisma.CartItemUncheckedCreateWithoutCartInput[]
        }
      },
      create: {
        userId: user.id,
        totalItems,
        totalAmount,
        appliedPromo,
        discountAmount,
        items: {
          create: items.map((item) => ({
            productId: item.id, 
            quantity: item.quantity,
            price: item.price
          })) as Prisma.CartItemUncheckedCreateWithoutCartInput[]
        }
      }
    });

    return NextResponse.json(cart);

  } catch (error) {
    console.error('Cart update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


async function verifyCartPrices(items: CartItem[]) {
  const validItems = [];
  const invalidItems = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.id },
      select: { price: true }
    });

    if (product && product.price === item.price) {
      validItems.push(item);
    } else {
      invalidItems.push(item);
    }
  }

  return { valid: invalidItems.length === 0, invalidItems };
}
