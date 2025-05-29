import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const gym = await prisma.gym.findUnique({
      where: { id },
    });

    if (!gym) {
      return NextResponse.json({ error: 'Gym not found' }, { status: 404 });
    }

    return NextResponse.json(gym);
  } catch (error) {
    console.error('Error fetching gym:', error);
    return NextResponse.json({ error: 'Failed to fetch gym' }, { status: 500 });
  }
}