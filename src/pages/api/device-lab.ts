import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { deviceName } = req.query;

  if (!deviceName || typeof deviceName !== "string") {
    return res.status(400).json({ error: "Missing device name" });
  }

  try {
    const channel = await prisma.channel.findFirst({
      where: { name: deviceName },
      include: { ApiKey: { include: { lab: true } } },
    });

    if (!channel || !channel.ApiKey.length || !channel.ApiKey[0].lab) {
      return res.status(404).json({ error: "Lab not found for device" });
    }

    const labLocation = channel.ApiKey[0].lab.labLocation;
    return res.status(200).json({ labLocation });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch lab location" });
  }
}
