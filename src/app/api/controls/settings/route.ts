import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch all default thresholds
export async function GET() {
  try {
    const thresholds = await prisma.defaultThreshold.findMany();
    console.log("GET /api/controls/settings - Fetched:", thresholds.length, "thresholds");
    return NextResponse.json({ fields: thresholds });
  } catch (error) {
    console.error("GET /api/controls/settings - Error:", error);
    return NextResponse.json(
      { error: `Failed to fetch default thresholds: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { fields } = await request.json();

    if (!fields || !Array.isArray(fields)) {
      return NextResponse.json({ error: "Invalid fields data" }, { status: 400 });
    }

    const upsertPromises = fields.map((field) =>
      prisma.defaultThreshold.upsert({
        where: { fieldName: field.fieldName }, // Unique by fieldName (add unique constraint in schema if needed)
        update: { minValue: field.minValue, maxValue: field.maxValue },
        create: {
          fieldName: field.fieldName,
          minValue: field.minValue,
          maxValue: field.maxValue,
        },
      })
    );

    const updatedThresholds = await Promise.all(upsertPromises);
    return NextResponse.json({ fields: updatedThresholds });
  } catch (error) {
    console.error("Error saving default thresholds:", error);
    return NextResponse.json(
      { error: `Failed to save default thresholds: ${error.message}` },
      { status: 500 }
    );
  }
}