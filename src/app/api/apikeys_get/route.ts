import { NextResponse } from "next/server";

import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const apikeys = await prisma.apiKey.findMany();
    return NextResponse.json(apikeys);
  } catch (error) {
    console.error("Error fetching apikeys:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}