// app/api/cart/sync-for-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '../../../../../auth';
import { z } from 'zod';

// Enhanced schema with more flexible validation
const cartSyncSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1, "Product ID is required"),
      title: z.string().min(1, "Title is required"),
      price: z.number().positive("Price must be positive"),
      originalPrice: z.number().positive().optional().nullable(),
      duration: z.string().default(""),
      instructor: z.string().default("Unknown"),
      image: z.string().default(""),
      category: z.string().default("Program"),
      quantity: z.number().int().positive("Quantity must be positive")
    })
  ),
  totalItems: z.number().int().nonnegative("Total items must be non-negative"),
  totalAmount: z.number().nonnegative("Total amount must be non-negative"),
  appliedPromo: z.string().nullable().optional(),
  discountAmount: z.number().nonnegative("Discount must be non-negative").default(0)
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    // Fix: Properly handle null/undefined email
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Please sign in to sync your cart', code: 'UNAUTHORIZED' }, 
        { status: 401 }
      );
    }

    // At this point, we know email exists and is a string
    const userEmail = session.user.email;

    let body;
    try {
      body = await req.json();
      console.log('Received cart data:', body);
    } catch (e) {
      console.error('JSON parse error:', e);
      return NextResponse.json(
        { error: 'Invalid request format', code: 'INVALID_JSON' },
        { status: 400 }
      );
    }

    const parsed = cartSyncSchema.safeParse(body);
    if (!parsed.success) {
      console.error('Validation failed:', parsed.error.issues);
      return NextResponse.json(
        { 
          error: 'Cart data validation failed',
          code: 'VALIDATION_ERROR',
          details: parsed.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    const { items, totalItems, totalAmount, appliedPromo, discountAmount } = parsed.data;

    // Validate that we have items to sync
    if (items.length === 0) {
      return NextResponse.json(
        { error: 'Cannot sync empty cart', code: 'EMPTY_CART' },
        { status: 400 }
      );
    }

    // Safer database transaction with better error handling
    const result = await prisma.$transaction(async (tx) => {
      // Fix: Use the extracted email variable (guaranteed to be string)
      const user = await tx.user.findUnique({
        where: { email: userEmail }, // Now TypeScript knows this is string
        select: { id: true, email: true }
      });

      if (!user) {
        throw new Error('USER_NOT_FOUND');
      }

      // Find existing cart
      const existingCart = await tx.cart.findUnique({
        where: { userId: user.id },
        include: { items: true }
      });

      // Delete existing cart items if cart exists
      if (existingCart) {
        await tx.cartItem.deleteMany({
          where: { cartId: existingCart.id }
        });
      }

      // Prepare cart items with validation
      const cartItems = items.map(item => ({
        productId: item.id,
        quantity: Math.max(1, item.quantity), // Ensure positive quantity
        price: Math.max(0, item.price), // Ensure positive price
     
      }));

      // Calculate totals for verification
      const calculatedTotal = cartItems.reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
      );
      const calculatedItems = cartItems.reduce(
        (sum, item) => sum + item.quantity, 
        0
      );

      // Verify totals match (with small tolerance for floating point)
      if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
        console.warn(`Total mismatch: calculated ${calculatedTotal}, received ${totalAmount}`);
      }

      if (calculatedItems !== totalItems) {
        console.warn(`Item count mismatch: calculated ${calculatedItems}, received ${totalItems}`);
      }

      // Upsert cart with corrected totals
      return await tx.cart.upsert({
        where: { userId: user.id },
        update: {
          totalItems: calculatedItems,
          totalAmount: calculatedTotal,
          appliedPromo: appliedPromo || null,
          discountAmount: Math.max(0, discountAmount),
          updatedAt: new Date(),
          items: {
            create: cartItems
          }
        },
        create: {
          userId: user.id,
          totalItems: calculatedItems,
          totalAmount: calculatedTotal,
          appliedPromo: appliedPromo || null,
          discountAmount: Math.max(0, discountAmount),
          items: {
            create: cartItems
          }
        },
        include: {
          items: {
            select: {
              id: true,
              productId: true,
              quantity: true,
              price: true,
             
            }
          }
        }
      });
    }, {
      maxWait: 5000, // Maximum time to wait for a transaction slot (5s)
      timeout: 10000, // Maximum time the transaction can run (10s)
    });

    console.log(`Cart synced successfully for user ${userEmail}: ${result.items.length} items`);

    return NextResponse.json({ 
      success: true, 
      cartId: result.id,
      itemCount: result.items.length,
      totalAmount: result.totalAmount,
      syncedAt: new Date().toISOString(),
      appliedPromo: result.appliedPromo,
      discountAmount: result.discountAmount
    });

  } catch (error: unknown) {
    console.error('Cart sync error:', error);
    
    if (error instanceof Error) {
      if (error.message === 'USER_NOT_FOUND') {
        return NextResponse.json(
          { error: 'User account not found', code: 'USER_NOT_FOUND' },
          { status: 404 }
        );
      }
      
      // Prisma specific errors
      if (error.message.includes('Prisma')) {
        console.error('Prisma error details:', error);
        return NextResponse.json(
          { error: 'Database operation failed', code: 'DB_ERROR' },
          { status: 500 }
        );
      }

      // Connection timeout errors
      if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
        return NextResponse.json(
          { error: 'Database connection timeout', code: 'DB_TIMEOUT' },
          { status: 503 }
        );
      }

      // Transaction errors
      if (error.message.includes('Transaction') || error.message.includes('deadlock')) {
        return NextResponse.json(
          { error: 'Database transaction failed. Please try again.', code: 'DB_TRANSACTION_ERROR' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'Cart sync failed. Please try again.',
        code: 'SYNC_ERROR',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}