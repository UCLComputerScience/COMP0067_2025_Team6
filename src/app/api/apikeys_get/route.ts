import { NextResponse } from "next/server";

import prisma from "../../../lib/prisma";

interface GetRequest {
  url: string;
}

interface ApiKey {
  id: number;
  key: string;
  labId: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(req: GetRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const labId = searchParams.get("labId");

    const apikeys = await prisma.apiKey.findMany({
      where: {
        labId: Number(labId),
      }
    });
    return NextResponse.json(apikeys);
  } catch (error) {
    console.error("Error fetching apikeys:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}