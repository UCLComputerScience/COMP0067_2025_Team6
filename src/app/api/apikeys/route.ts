import { NextResponse } from "next/server";

import prisma from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { api, channel_id } = await req.json();

    if (!channel_id || !api) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    console.log("Received Data:", { api, channel_id });

    const newApi = await prisma.apiKey.create({
      data: { api, channel_id: Number(channel_id) },
    });

    return NextResponse.json(newApi, { status: 201 });
  } catch (error: any) {
    console.error("Error saving API key:", error.message);
    return NextResponse.json({ error: "Failed to save API", details: error.message }, { status: 500 });
  }
}
