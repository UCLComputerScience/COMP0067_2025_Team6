import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const apikeys = await prisma.apiKey.findMany({
      select: {
        api: true,
        labId: true,
      },
    });

    return NextResponse.json(apikeys);
  } catch (error) {
    console.error("Error fetching apikeys:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}