import { NextResponse } from "next/server";

import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const channels = await prisma.channel.findMany();
    return NextResponse.json(channels);
  } catch (error) {
    console.error("Error fetching channels:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}