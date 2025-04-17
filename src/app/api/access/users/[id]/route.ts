import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        organisation: true,
        userRole: true,
        status: true,
        access: {
          select: {
            channelId: true,
            channel: { select: { name: true } },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Deduplicate access entries based on channelId
    const uniqueAccess: { channelId: number | null; channelName: string | null }[] = [];
    const seenChannelIds = new Set<number>();

    for (const a of user.access) {
      // Handle channelId
      if (a.channelId !== null && !seenChannelIds.has(a.channelId)) {
        seenChannelIds.add(a.channelId);
        uniqueAccess.push({
          channelId: a.channelId,
          channelName: a.channel?.name || null,
        });
      }
    }

    const formattedUser = {
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      organisation: user.organisation,
      role: user.userRole,
      status: user.status,
      access: uniqueAccess,
    };

    return NextResponse.json(formattedUser, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}