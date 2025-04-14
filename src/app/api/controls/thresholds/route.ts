import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  console.log("GET /api/controls/thresholds - Accessed:", req.url);
  try {
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get("channelId");

    if (!channelId || isNaN(Number(channelId))) {
      console.log("GET /api/controls/thresholds - Invalid channelId:", channelId);
      return NextResponse.json({ error: "Invalid channelId" }, { status: 400 });
    }

    const thresholds = await prisma.threshold.findMany({
      where: { channelId: Number(channelId) },
      select: {
        fieldName: true,
        minValue: true,
        maxValue: true,
        unit: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log(
      `GET /api/controls/thresholds?channelId=${channelId} - Fetched:`,
      thresholds.length,
      "thresholds"
    );
    return NextResponse.json({ thresholds }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/controls/thresholds - Error:", error);
    return NextResponse.json(
      { error: `Failed to fetch thresholds: ${error.message}` },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  try {
    const { channelId, thresholds } = await req.json();

    if (!channelId || isNaN(Number(channelId))) {
      console.log("POST /api/controls/thresholds - Invalid channelId:", channelId);
      return NextResponse.json({ error: "Invalid channelId" }, { status: 400 });
    }

    if (!Array.isArray(thresholds)) {
      console.log("POST /api/controls/thresholds - Thresholds is not an array:", thresholds);
      return NextResponse.json({ error: "Thresholds must be an array" }, { status: 400 });
    }

    if (thresholds.length === 0) {
      await prisma.threshold.deleteMany({
        where: { channelId: Number(channelId) },
      });
      console.log(`POST /api/controls/thresholds - Cleared thresholds for channelId=${channelId}`);
      return NextResponse.json({ thresholds: [] }, { status: 200 });
    }

    // Validate thresholds with type checking
    const invalidThresholds = thresholds.filter(
      (t: any) =>
        typeof t.fieldName !== "string" ||
        t.fieldName.trim() === "" ||
        t.minValue == null ||
        t.maxValue == null ||
        isNaN(Number(t.minValue)) ||
        isNaN(Number(t.maxValue)) ||
        Number(t.minValue) >= Number(t.maxValue)
    );
    if (invalidThresholds.length > 0) {
      console.log("POST /api/controls/thresholds - Invalid thresholds:", invalidThresholds);
      return NextResponse.json(
        {
          error:
            "Invalid threshold data: fieldName must be a non-empty string, minValue and maxValue must be numbers, with minValue < maxValue",
        },
        { status: 400 }
      );
    }

    // Upsert thresholds
    const upsertPromises = thresholds.map((threshold: any) =>
      prisma.threshold.upsert({
        where: {
          channelId_fieldName: {
            channelId: Number(channelId),
            fieldName: threshold.fieldName,
          },
        },
        update: {
          minValue: Number(threshold.minValue),
          maxValue: Number(threshold.maxValue),
          unit: threshold.unit || null,
          updatedAt: new Date(),
        },
        create: {
          channelId: Number(channelId),
          fieldName: threshold.fieldName,
          minValue: Number(threshold.minValue),
          maxValue: Number(threshold.maxValue),
          unit: threshold.unit || null,
          createdAt: new Date(),
        },
      })
    );

    const updatedThresholds = await Promise.all(upsertPromises);
    console.log(`POST /api/controls/thresholds - Updated ${updatedThresholds.length} thresholds for channelId=${channelId}`);
    return NextResponse.json({ thresholds: updatedThresholds }, { status: 200 });
  } catch (error: any) {
    console.error("POST /api/controls/thresholds - Error:", error);
    return NextResponse.json(
      { error: `Failed to save thresholds: ${error.message}` },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}