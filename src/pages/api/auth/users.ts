import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
// import { authOptions } from "./[...nextauth]";
import { authOptions } from "@/lib/authOptions"; 

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
          status: true,
        },
      });

      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const session = await getServerSession(req, res, authOptions);
      const { userIds, role, currentUserEmail } = req.body;

      console.log("Incoming POST data:", { userIds, role, currentUserEmail });

      const userEmail = (session?.user?.email || currentUserEmail || "").toLowerCase();
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0 || !role) {
        return res.status(400).json({ error: "Missing user IDs or role" });
      }

      const validRoles = ["ADMIN", "STANDARD_USER", "SUPER_USER", "TEMPORARY_USER"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      // Update user roles
      await prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: { userRole: role },
      });

      console.log(`Updated roles for ${userIds.length} users to: ${role}`);

      // Log usage history
      if (userEmail) {
        try {
          const emailExists = await prisma.user.findUnique({ where: { email: userEmail } });

          const log = await prisma.usageHistory.create({
            data: {
              timestamp: new Date(),
              userEmail,
              action: `Changed ${userIds.length} user(s) role to ${role}`,
              metadata: {
                userIds: userIds.map((id: number | string) => String(id)),
                newRole: role,
              },
              // No need to link relation explicitly; will connect if email exists
            },
          });

          console.log("Usage history logged successfully:", log.id);
        } catch (logError) {
          console.error("Error logging usage history:", logError);
        }
      } else {
        console.warn("No valid user email provided for logging.");
      }

      return res.status(200).json({ message: `Updated ${userIds.length} users successfully` });
    } catch (error) {
      console.error("Error processing POST /users:", error);
      return res.status(500).json({ error: "Failed to update roles" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
