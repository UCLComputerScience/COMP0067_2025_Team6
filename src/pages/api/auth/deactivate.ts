import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
)  {
  console.log("🚀 Deactivate API route hit!");
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { userIds } = req.body;
    console.log("Received userIds:", userIds);

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing user IDs" });
    }

    const formattedUserIds = userIds.map(id => parseInt(id, 10)); // Convert string IDs to integers

    const result = await prisma.user.updateMany({
      where: { id: { in: formattedUserIds } },  // Use formattedUserIds here
      data: { status: "INACTIVE" },
    })

    console.log("Prisma update result:", result);

    if (result.count === 0) {
      return res.status(404).json({ error: "No users found with provided IDs" });
    }

    return res.status(200).json({ message: "Users deactivated successfully" });
  } catch (error: any) {
    console.error("Error deactivating users:", JSON.stringify(error, null, 2));
    return res.status(500).json({ error: error instanceof Error ? error.message : "Internal Server Error" });
  }
}