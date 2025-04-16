import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const channelId = searchParams.get("channelId");

  if (!channelId || isNaN(Number(channelId))) {
    return NextResponse.json({ error: "Invalid channel ID" }, { status: 400 });
  }

  try {
    await prisma.channel.delete({
      where: { id: Number(channelId) },
    });
    return NextResponse.json({ message: "Channel deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting channel:", error);
    return NextResponse.json({ error: "Failed to delete channel" }, { status: 500 });
  }
}