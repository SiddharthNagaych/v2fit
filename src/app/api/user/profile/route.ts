import { auth } from '../../../../../auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      purchases: {
        include: {
          program: true
        }
      },
      payments: true
    }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    name: user.name,
    email: user.email,
    role: user.role,
    payments: user.payments,
    purchases: user.purchases.map(p => ({
      id: p.id,
      title: p.program.title,
      price: p.program.price,
      level: p.program.level,
      purchasedAt: p.createdAt
    }))
  });
}
