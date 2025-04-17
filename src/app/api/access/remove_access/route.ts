import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// const prisma = new PrismaClient();
import prisma from "../../../../lib/prisma";

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

    // Validate channelId
    if (!channelId || isNaN(parseInt(channelId))) {
      return NextResponse.json(
        { error: "Missing or invalid channelId" },
        { status: 400 }
      );
    }
    const parsedChannelId = parseInt(channelId);

    // Validate channel exists
    const channel = await prisma.channel.findUnique({
      where: { id: parsedChannelId },
    });
    if (!channel) {
      console.warn(`Invalid channelId: Channel ID ${parsedChannelId} not found`);
      return NextResponse.json(
        { error: "Invalid channelId: Channel not found" },
        { status: 400 }
      );
    }

    // Validate userIds exist in User table and collect emails
    const validUserIds: number[] = [];
    const invalidUserIds: string[] = [];
    const affectedUserEmails: string[] = [];
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
        affectedUserEmails.push(user.email.toLowerCase());
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

    // Check for existing access records to delete
    const accessToDelete = await prisma.access.findMany({
      where: {
        userId: { in: validUserIds },
        channelId: parsedChannelId,
      },
      select: { userId: true },
    });

    const accessUserIds = accessToDelete.map((access) => access.userId);
    const noAccessUserIds = validUserIds.filter(
      (id) => !accessUserIds.includes(id)
    );

    // Prepare response message
    let responseMessage = "";
    if (accessUserIds.length === 0) {
      responseMessage = `No access found for the specified user(s) on channel ${parsedChannelId}`;
      return NextResponse.json({ message: responseMessage }, { status: 404 });
    } else {
      responseMessage = `Access removed successfully for ${accessUserIds.length} user(s)`;
    }

    // Perform deletion and logging in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete access records
      await tx.access.deleteMany({
        where: {
          userId: { in: accessUserIds },
          channelId: parsedChannelId,
        },
      });

      // Log usage history
      const logMessage = affectedUserEmails.length > 0
        ? `Removed access for ${affectedUserEmails.join(", ")} from channel ${parsedChannelId}`
        : `Removed access for ${accessUserIds.length} user(s) from channel ${parsedChannelId} (no emails available)`;

      console.log("Attempting to log usage history:", { userEmail, action: logMessage });

      const log = await tx.usageHistory.create({
        data: {
          timestamp: new Date(),
          userEmail,
          action: logMessage,
          metadata: {
            userIds: validUserIds.map((id) => String(id)),
            channelId: String(parsedChannelId),
            grantedBy: String(parsedGrantedBy),
          },
        },
      });

      console.log("Usage history logged successfully:", log.id);
    });

 
    if (noAccessUserIds.length > 0 || invalidUserIds.length > 0) {
      const details: { noAccessUserIds?: number[]; invalidUserIds?: string[] } = {};
      if (noAccessUserIds.length > 0) details.noAccessUserIds = noAccessUserIds;
      if (invalidUserIds.length > 0) details.invalidUserIds = invalidUserIds;
      return NextResponse.json(
        { message: responseMessage, details },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: responseMessage }, { status: 200 });
  } catch (error) {
    console.error("Error processing POST /access/remove_access:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}