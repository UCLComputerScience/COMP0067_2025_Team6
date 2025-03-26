import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);

    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.apiKey.deleteMany({
      where: { channelId: Number(id) }
    });

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting record:", error);
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }
}