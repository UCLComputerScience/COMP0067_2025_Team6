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
            labId: true,
            lab: { select: { labLocation: true } },
            channelId: true,
            channel: { select: { name: true } },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const formattedUser = {
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      organisation: user.organisation,
      role: user.userRole,
      status: user.status,
      access: user.access.map((a) => ({
        labId: a.labId,
        labLocation: a.lab?.labLocation || null,
        channelId: a.channelId,
        channelName: a.channel?.name || null,
      })),
    };

    return NextResponse.json(formattedUser, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}