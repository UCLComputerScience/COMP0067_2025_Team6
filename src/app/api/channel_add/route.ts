import { NextResponse } from "next/server";

import prisma from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { channelId, name, latitude, longitude, field1, field2, field3, field4, field5, field6, field7, field8, created_at, updated_at, last_entry_id } = await req.json();

    if (!channelId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    console.log("Received Data:", { channelId });

    const newChannel = await prisma.channel.create({
      data: { id: Number(channelId), name, latitude: parseFloat(latitude), longitude: parseFloat(longitude), field1, field2, field3, field4, field5, field6, field7, field8, createdAt: new Date(created_at), updatedAt: new Date(updated_at), lastEntryId: Number(last_entry_id) },
    });

    return NextResponse.json(newChannel, { status: 201 });
  } catch (error: any) {
    console.error("Error saving Channel:", error.message);
    return NextResponse.json({ error: "Failed to save Channel", details: error.message }, { status: 500 });
  }
}
