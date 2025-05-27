// app/api/gym/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const gyms = await prisma.gym.findMany();
    return NextResponse.json(gyms);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch gyms' }, { status: 500 });
  }
}
