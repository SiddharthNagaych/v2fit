// app/api/programs/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const programs = await prisma.product.findMany();
    return NextResponse.json(programs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch programs", error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}