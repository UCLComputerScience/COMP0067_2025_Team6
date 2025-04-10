import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json(
      { message: "Channel ID is required and must be a number" },
      { status: 400 }
    );
  }

  const session = await getSession({ req: req as any });
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { userRole: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const channel = await prisma.channel.findUnique({
      where: { id: parseInt(id) },
      include: {
        feed: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!channel) {
      return NextResponse.json({ message: "Channel not found" }, { status: 404 });
    }

    if (user.userRole === "ADMIN" || user.userRole === "SUPER_USER") {
      // Admins and Super Users can access any channel
      return NextResponse.json(channel, { status: 200 });
    } else if (user.userRole === "STANDARD_USER" || user.userRole === "TEMPORARY_USER") {
      // Placeholder: No access for now
      return NextResponse.json(
        { message: "No access to this channel (placeholder)" },
        { status: 403 }
      );
      // TODO: Replace with logic to check specific channel access
      // Example placeholder logic (commented out):
      // const hasAccess = await prisma.apiKey.findFirst({
      //   where: { channelId: channel.id, labId: { in: (await prisma.user.findUnique({ where: { id: userId }, include: { labs: true } })).labs.map(l => l.id) } },
      // });
      // if (!hasAccess) return NextResponse.json({ message: "No access to this channel" }, { status: 403 });
      // return NextResponse.json(channel, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Insufficient permissions" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}