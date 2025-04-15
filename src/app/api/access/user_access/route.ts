import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userIds, labId, channelId, grantedBy } = await req.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { message: "Invalid or empty userIds" },
        { status: 400 }
      );
    }

    // Create access records for each user
    const accessRecords = await prisma.$transaction(
      userIds.map((userId: string) =>
        prisma.access.create({
          data: {
            userId: parseInt(userId),
            labId: labId ? parseInt(labId) : null,
            channelId: channelId ? parseInt(channelId) : null,
            grantedBy: grantedBy ? parseInt(grantedBy) : null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })
      )
    );

    return NextResponse.json(accessRecords, { status: 201 });
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