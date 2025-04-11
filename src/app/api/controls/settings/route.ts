import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path to your Prisma client

// GET: Fetch all default thresholds
export async function GET() {
  try {
    const thresholds = await prisma.defaultThreshold.findMany();
    return NextResponse.json({ fields: thresholds });
  } catch (error) {
    console.error("Error fetching default thresholds:", error);
    return NextResponse.json(
      { error: "Failed to fetch default thresholds" },
      { status: 500 }
    );
  }
}

// POST: Save or update default thresholds
export async function POST(request: Request) {
  try {
    const { fields } = await request.json();

    // Validate input
    if (!fields || !Array.isArray(fields)) {
      return NextResponse.json(
        { error: "Invalid fields data" },
        { status: 400 }
      );
    }

    // Clear existing default thresholds
    await prisma.defaultThreshold.deleteMany();

    // Create new default thresholds
    const createdThresholds = await prisma.defaultThreshold.createMany({
      data: fields.map((field: { fieldName: string; minValue: number; maxValue: number }) => ({
        fieldName: field.fieldName,
        minValue: field.minValue,
        maxValue: field.maxValue,
      })),
    });

    return NextResponse.json({ fields: createdThresholds });
  } catch (error) {
    console.error("Error saving default thresholds:", error);
    return NextResponse.json(
      { error: "Failed to save default thresholds" },
      { status: 500 }
    );
  }
}