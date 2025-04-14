// import { NextResponse } from "next/server";
//  import { PrismaClient } from "@prisma/client";
 
//  const prisma = new PrismaClient();
 
//  export async function GET() {
//    try {
//      const thresholds = await prisma.defaultThreshold.findMany();
//      console.log("GET /api/controls/settings - Fetched:", thresholds.length, "thresholds");
//      return NextResponse.json({ fields: thresholds });
//    } catch (error) {
//      console.error("GET /api/controls/settings - Error:", error);
//      return NextResponse.json(
//        { error: `Failed to fetch default thresholds: ${error.message}` },
//        { status: 500 }
//      );
//    }
//  }
 
//  export async function POST(request: Request) {
//    try {
//      const { fields } = await request.json();
 
//      if (!fields || !Array.isArray(fields)) {
//        return NextResponse.json({ error: "Invalid fields data" }, { status: 400 });
//      }
 
//      const upsertPromises = fields.map((field) =>
//        prisma.defaultThreshold.upsert({
//          where: { fieldName: field.fieldName },
//          update: { minValue: field.minValue, maxValue: field.maxValue, unit: field.unit },
//          create: {
//            fieldName: field.fieldName,
//            minValue: field.minValue,
//            maxValue: field.maxValue,
//            unit: field.unit,
//          },
//        })
//      );
 
//      const updatedThresholds = await Promise.all(upsertPromises);
//      return NextResponse.json({ fields: updatedThresholds });
//    } catch (error) {
//      console.error("Error saving default thresholds:", error);
//      return NextResponse.json(
//        { error: `Failed to save default thresholds: ${error.message}` },
//        { status: 500 }
//      );
//    }
//  }

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

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
    return NextResponse.json({ thresholds });
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
  console.log("POST /api/controls/thresholds - Accessed:", req.url);
  try {
    const { channelId, thresholds } = await req.json();
    console.log("POST /api/controls/thresholds - Payload:", { channelId, thresholds });

    if (!channelId || isNaN(Number(channelId))) {
      console.log("POST /api/controls/thresholds - Invalid channelId:", channelId);
      return NextResponse.json({ error: "Invalid channelId" }, { status: 400 });
    }

    if (!thresholds || !Array.isArray(thresholds)) {
      console.log("POST /api/controls/thresholds - Invalid thresholds data:", thresholds);
      return NextResponse.json(
        { error: "Invalid thresholds data" },
        { status: 400 }
      );
    }

    // Validate thresholds
    const invalidThresholds = thresholds.filter(
      (threshold) =>
        !threshold.fieldName ||
        isNaN(Number(threshold.minValue)) ||
        isNaN(Number(threshold.maxValue)) ||
        Number(threshold.minValue) >= Number(threshold.maxValue)
    );
    if (invalidThresholds.length > 0) {
      console.log("POST /api/controls/thresholds - Invalid thresholds:", invalidThresholds);
      return NextResponse.json(
        {
          error:
            "All thresholds must have a valid fieldName and numeric min/max values, with min less than max",
        },
        { status: 400 }
      );
    }

    // Get existing thresholds for the channel
    const existingThresholds = await prisma.threshold.findMany({
      where: { channelId: Number(channelId) },
      select: { fieldName: true },
    });
    const existingFieldNames = existingThresholds.map((t) => t.fieldName);
    const submittedFieldNames = thresholds.map((t) => t.fieldName);

    // Identify thresholds to delete (not in submitted thresholds)
    const thresholdsToDelete = existingFieldNames.filter(
      (fieldName) => !submittedFieldNames.includes(fieldName)
    );

    // Delete removed thresholds
    if (thresholdsToDelete.length > 0) {
      await prisma.threshold.deleteMany({
        where: {
          channelId: Number(channelId),
          fieldName: { in: thresholdsToDelete },
        },
      });
      console.log(
        `POST /api/controls/thresholds - Deleted thresholds for channelId=${channelId}:`,
        thresholdsToDelete
      );
    }

    // Upsert submitted thresholds
    const upsertPromises = thresholds.map((threshold) =>
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
    console.log(
      `POST /api/controls/thresholds - Updated/Created for channelId=${channelId}:`,
      updatedThresholds.length,
      "thresholds"
    );
    return NextResponse.json({ thresholds: updatedThresholds });
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