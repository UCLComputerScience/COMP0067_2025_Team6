import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channelId = searchParams.get("channelId");

  if (!channelId || isNaN(Number(channelId))) {
    return NextResponse.json({ error: "Invalid channelId" }, { status: 400 });
  }

  try {
    const thresholds = await prisma.threshold.findMany({
      where: { channelId: Number(channelId) },
      select: {
        fieldName: true,
        minValue: true,
        maxValue: true,
        unit: true,
      },
    });

    console.log(`GET /api/controls/thresholds?channelId=${channelId} - Fetched: ${thresholds.length} thresholds`);
    return NextResponse.json({ thresholds }, { status: 200 });
  } catch (error) {
    console.error(`GET /api/controls/thresholds?channelId=${channelId} - Error:`, error);
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

    if (!channelId || isNaN(Number(channelId)) || !Array.isArray(thresholds)) {
      return NextResponse.json(
        { error: "Invalid channelId or thresholds data" },
        { status: 400 }
      );
    }

    // Validate thresholds
    const invalidThresholds = thresholds.filter(
      (t: any) =>
        !t.fieldName ||
        t.minValue === "" ||
        t.maxValue === "" ||
        isNaN(Number(t.minValue)) ||
        isNaN(Number(t.maxValue)) ||
        Number(t.minValue) >= Number(t.maxValue)
    );
    if (invalidThresholds.length > 0) {
      return NextResponse.json(
        {
          error:
            "Invalid threshold data: fieldName, minValue, and maxValue required, with minValue < maxValue",
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
        },
        create: {
          channelId: Number(channelId),
          fieldName: threshold.fieldName,
          minValue: Number(threshold.minValue),
          maxValue: Number(threshold.maxValue),
          unit: threshold.unit || null,
        },
      })
    );

    const updatedThresholds = await Promise.all(upsertPromises);
    console.log(`POST /api/controls/thresholds - Updated thresholds for channelId=${channelId}`);
    return NextResponse.json({ thresholds: updatedThresholds }, { status: 200 });
  } catch (error) {
    console.error("POST /api/controls/thresholds - Error:", error);
    return NextResponse.json(
      { error: `Failed to save thresholds: ${error.message}` },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}