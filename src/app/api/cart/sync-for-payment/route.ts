// app/api/cart/sync-for-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '../../../../../auth';
import { z } from 'zod';

const cartSyncSchema = z.object({
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

    const parsed = cartSyncSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid cart data', details: parsed.error },
        { status: 400 }
      );
    }

    const { items, totalItems, totalAmount, appliedPromo, discountAmount } = parsed.data;

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Force sync cart to database (skip price verification for now)
    const cart = await prisma.cart.upsert({
      where: { userId: user.id },
      update: {
        totalItems,
        totalAmount,
        appliedPromo,
        discountAmount,
        updatedAt: new Date(),
        items: {
          deleteMany: {},
          create: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
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
          }))
        }
      }
    });

    return NextResponse.json({ success: true, cartId: cart.id });
  } catch (error) {
    console.error('Cart sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}