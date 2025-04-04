import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma"; // Adjust import based on your setup

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing user IDs" });
    }

    // Update users' status to INACTIVE
    await prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: { status: "INACTIVE" },
    });

    return res.status(200).json({ message: "Users deactivated successfully" });
  } catch (error) {
    console.error("Error deactivating users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
