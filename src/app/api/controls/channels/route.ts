import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; 

// const prisma = new PrismaClient();
import prisma from "../../../../lib/prisma";

export async function GET(req: NextRequest) {
  console.log("Server-side DATABASE_URL:", process.env.DATABASE_URL);

  try {
    // Extract userId from query parameters
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get("userId");

    if (!userIdParam) {
      return NextResponse.json(
        { message: "Missing userId query parameter" },
        { status: 400 }
      );
    }

    const userId = parseInt(userIdParam, 10);
    if (isNaN(userId)) {
      return NextResponse.json(
        { message: "Invalid userId: must be a number" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.id !== userIdParam) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Check user role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { userRole: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    let channels;

    if (user.userRole === "ADMIN") {
      // Admins see all channels
      channels = await prisma.channel.findMany({
        include: {
          ApiKey: true,
        },
      });
    } else {
      // Non-admins see only channels they have access to
      channels = await prisma.channel.findMany({
        where: {
          access: {
            some: {
              userId: userId,
            },
          },
        },
        include: {
          ApiKey: true,
        },
      });
    }

    return NextResponse.json(channels, { status: 200 });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}