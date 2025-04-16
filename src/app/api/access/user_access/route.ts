import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userIds, channelId, grantedBy } = await req.json();

    // Validate input
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { message: "Invalid or empty userIds" },
        { status: 400 }
      );
    }

    // Validate channelId if provided
    if (channelId && isNaN(parseInt(channelId))) {
      return NextResponse.json(
        { message: "Invalid channelId" },
        { status: 400 }
      );
    }
    if (grantedBy && isNaN(parseInt(grantedBy))) {
      return NextResponse.json(
        { message: "Invalid grantedBy" },
        { status: 400 }
      );
    }

    const parsedChannelId = channelId ? parseInt(channelId) : null;
    const parsedGrantedBy = grantedBy ? parseInt(grantedBy) : null;

    // Check for existing access records and collect new ones to create
    const accessToCreate = [];
    const alreadyGranted = [];

    for (const userId of userIds) {
      const parsedUserId = parseInt(userId);
      if (isNaN(parsedUserId)) {
        return NextResponse.json(
          { message: `Invalid userId: ${userId}` },
          { status: 400 }
        );
      }

      // Check if access already exists
      const existingAccess = await prisma.access.findFirst({
        where: {
          userId: parsedUserId,
          channelId: parsedChannelId,
        },
      });

      if (existingAccess) {
        alreadyGranted.push(userId);
      } else {
        accessToCreate.push({
          userId: parsedUserId,
          channelId: parsedChannelId,
          grantedBy: parsedGrantedBy,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // If all users already have access, return early
    if (accessToCreate.length === 0) {
      return NextResponse.json(
        {
          message: `Access already granted for ${alreadyGranted.length} user(s)`,
        },
        { status: 409 } // Conflict status
      );
    }

    // Create new access records in a transaction
    const accessRecords = await prisma.$transaction(
      accessToCreate.map((data) =>
        prisma.access.create({
          data,
        })
      )
    );

    // Prepare response
    let responseMessage = `Access granted successfully for ${accessRecords.length} user(s)`;
    if (alreadyGranted.length > 0) {
      responseMessage += `. Note: Access already granted for ${alreadyGranted.length} user(s)`;
    }

    return NextResponse.json(
      {
        message: responseMessage,
        accessRecords,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error:", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        {
          message: "Access already exists for one or more users",
          error: error.message,
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}