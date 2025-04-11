import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      // Fetch usage history where the user is not null
      const usageHistory = await prisma.usageHistory.findMany({
        where: {
          // Ensure the log has a valid associated user
          user: {
            // Use 'NOT' to filter out null user
            // We are checking for the existence of a related user (non-null user)
            NOT: {
              id: undefined, // id is undefined, meaning we expect a valid user
            },
          },
        },
        include: {
          user: true, // Include related user data (assuming user model is present)
        },
      });

      console.log("Fetched usageHistory:", usageHistory); // Log the fetched data
      return res.status(200).json(usageHistory);
    } catch (error) {
      console.error("Error fetching usage history:", error);
      return res.status(500).json({ message: "Error fetching usage history" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
