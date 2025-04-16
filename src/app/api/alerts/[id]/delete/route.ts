import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id); // Convert string to number if your ID is numeric
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
  try {
    await prisma.alerts.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting alert:", error);
    return NextResponse.json({ error: "Failed to delete alert" }, { status: 500 });
  }
}