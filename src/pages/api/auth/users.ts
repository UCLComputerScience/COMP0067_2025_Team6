import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      console.log("Fetching users from database...");
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          organisation: true,
          userRole: true,
        },
      });

      console.log("Fetched users:", users);
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Internal server error", details: (error instanceof Error ? error.message : "Unknown error") });
    }
  } 
  
  else if (req.method === "POST") {
    try {
      const { userIds, role } = req.body;
      console.log("Updating user roles:", { userIds, role });

      if (!userIds || !role || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ error: "Missing user IDs or role" });
      }

      const validRoles = ["ADMIN", "STANDARD_USER", "SUPER_USER", "TEMPORARY_USER"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      await prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: { userRole: role },
      });

      console.log(`Updated ${userIds.length} users to role: ${role}`);
      return res.status(200).json({ message: `Updated ${userIds.length} users successfully` });
    } catch (error) {
      console.error("Error updating user roles:", error);
      return res.status(500).json({ 
        error: "Failed to update roles", 
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  } 
  
  else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
