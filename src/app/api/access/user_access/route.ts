import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userIds, channelId, grantedBy } = await req.json();

    console.log("Incoming POST data:", { userIds, channelId, grantedBy });

    // Validate grantedBy for authentication
    if (!grantedBy || isNaN(parseInt(grantedBy))) {
      console.warn("Invalid or missing grantedBy");
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid grantedBy" },
        { status: 401 }
      );
    }
    const parsedGrantedBy = parseInt(grantedBy);
    const grantedByUser = await prisma.user.findUnique({
      where: { id: parsedGrantedBy },
      select: { id: true, email: true },
    });
    if (!grantedByUser) {
      console.warn(`Invalid grantedBy: User ID ${parsedGrantedBy} not found`);
      return NextResponse.json(
        { error: "Unauthorized: Invalid grantedBy user" },
        { status: 401 }
      );
    }
    const userEmail = grantedByUser.email.toLowerCase();

    // Validate input
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid userIds" },
        { status: 400 }
      );
    }

    // Validate channelId if provided
    if (channelId && isNaN(parseInt(channelId))) {
      return NextResponse.json(
        { error: "Invalid channelId" },
        { status: 400 }
      );
    }
    const parsedChannelId = channelId ? parseInt(channelId) : null;

    // Validate userIds exist in User table and collect emails
    const validUserIds: number[] = [];
    const invalidUserIds: string[] = [];
    const grantedUserEmails: string[] = [];
    for (const userId of userIds) {
      const parsedUserId = parseInt(userId);
      if (isNaN(parsedUserId)) {
        invalidUserIds.push(userId);
        continue;
      }
      const user = await prisma.user.findUnique({
        where: { id: parsedUserId },
        select: { id: true, email: true },
      });
      if (user) {
        validUserIds.push(parsedUserId);
        grantedUserEmails.push(user.email.toLowerCase());
      } else {
        invalidUserIds.push(userId);
      }
    }

    if (validUserIds.length === 0) {
      return NextResponse.json(
        { error: `No valid user IDs provided. Invalid: ${invalidUserIds.join(", ")}` },
        { status: 400 }
      );
    }

    if (invalidUserIds.length > 0) {
      console.warn("Some user IDs are invalid:", invalidUserIds);
    }

    // Check for existing access records and collect new ones to create
    const accessToCreate = [];
    const alreadyGranted = [];

    for (const userId of validUserIds) {
      const existingAccess = await prisma.access.findFirst({
        where: {
          userId,
          channelId: parsedChannelId,
        },
      });

      if (existingAccess) {
        alreadyGranted.push(userId);
      } else {
        accessToCreate.push({
          userId,
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
        { status: 409 }
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

    // Log usage history with granted users' emails
    try {
      const log = await prisma.usageHistory.create({
        data: {
          timestamp: new Date(),
          userEmail,
          action: `Granted access to ${grantedUserEmails.join(", ")} for Channel ${parsedChannelId || "none"}`,
          metadata: {
            userIds: validUserIds.map((id) => String(id)),
            channelId: parsedChannelId ? String(parsedChannelId) : null,
            grantedBy: String(parsedGrantedBy),
          },
        },
      });
      console.log("Usage history logged successfully:", log.id);
    } catch (logError) {
      console.error("Error logging usage history:", logError);
    }

    // Prepare response
    let responseMessage = `Access granted successfully for ${accessRecords.length} user(s)`;
    if (alreadyGranted.length > 0) {
      responseMessage += `. Note: Access already granted for ${alreadyGranted.length} user(s)`;
    }
    if (invalidUserIds.length > 0) {
      responseMessage += `. Invalid user IDs: ${invalidUserIds.join(", ")}`;
    }

    return NextResponse.json(
      {
        message: responseMessage,
        accessRecords,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing POST /access:", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Access already exists for one or more users" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}