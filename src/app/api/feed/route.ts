import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const feeds = await prisma.feed.findMany();
    return NextResponse.json(feeds);
  } catch (error) {
    console.error("Error fetching channels:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}