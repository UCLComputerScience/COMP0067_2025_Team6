import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const thresholds = await prisma.defaultThreshold.findMany();
    const settings = {
      fields: thresholds.map((t) => ({
        name: t.fieldName,
        min: t.minValue,
        max: t.maxValue,
      })),
    };
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("Error fetching default thresholds:", error);
    return NextResponse.json({ message: "Error fetching settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { fields } = await request.json();
    await prisma.defaultThreshold.deleteMany();
    await prisma.defaultThreshold.createMany({
      data: fields.map((field: { name: string; min: number; max: number }) => ({
        fieldName: field.name,
        minValue: field.min,
        maxValue: field.max,
      })),
    });
    return NextResponse.json({ message: "Default settings saved" }, { status: 200 });
  } catch (error) {
    console.error("Error saving default thresholds:", error);
    return NextResponse.json({ message: "Error saving settings" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}