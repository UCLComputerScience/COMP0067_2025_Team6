import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 


export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id); // Convert string to number if your ID is numeric
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
  try {
    const updatedAlert = await prisma.alerts.update({
      where: { id },
      data: { alertStatus: "RESOLVED" }, // Adjust field name based on your schema
    });
    return NextResponse.json(updatedAlert, { status: 200 });
  } catch (error) {
    console.error("Error updating alert:", error);
    return NextResponse.json({ error: "Failed to update alert" }, { status: 500 });
  }
}