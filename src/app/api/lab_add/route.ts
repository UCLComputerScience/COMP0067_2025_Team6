import { NextResponse } from "next/server";

import prisma from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { labmanager, labLocation } = await req.json();

    if (!labmanager || !labLocation) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    console.log("Received Data:", { labmanager });

    const newLab = await prisma.labs.create({
      data: { managerId: labmanager, labLocation },
    });

    return NextResponse.json(newLab, { status: 201 });
  } catch (error: any) {
    console.error("Error saving Lab:", error.message);
    return NextResponse.json({ error: "Failed to save Lab", details: error.message }, { status: 500 });
  }
}
