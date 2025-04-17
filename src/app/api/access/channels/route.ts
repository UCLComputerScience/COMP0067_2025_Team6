import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// const prisma = new PrismaClient();
import prisma from "../../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const channels = await prisma.channel.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return NextResponse.json(channels, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}