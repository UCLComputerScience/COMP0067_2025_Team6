// /app/api/channels/route.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const channels = await prisma.channel.findMany({
      include: {
        ApiKey: {
          include: {
            lab: true, // Include Labs data linked via labId
          },
        },
      },
    });

    return NextResponse.json(channels, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}