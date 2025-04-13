import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";  
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userEmail = session.user?.email;

  const user = await prisma.user.findUnique({
    where: { email: userEmail! },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  if (req.method === "POST") {
    const { action, labLocation, device } = req.body;

    try {
      const newLog = await prisma.activityLog.create({
        data: {
          action,
          user: fullName,
          labLocation,
          device,
        },
      });

      return res.status(201).json(newLog);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to create log" });
    }
  }

  if (req.method === "GET") {
    try {
      const logs = await prisma.activityLog.findMany({
        orderBy: { timestamp: "desc" },
      });

      return res.status(200).json(logs);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch logs" });
    }
  }

  return res.status(405).end(); 
}
