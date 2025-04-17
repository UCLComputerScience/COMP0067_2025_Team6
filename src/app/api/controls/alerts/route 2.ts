import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { entryId, channelId, fieldName, alertDescription, priority } = req.body;

      // Validate required fields
      if (!entryId || !channelId || !fieldName || !alertDescription) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if an unresolved alert already exists for this entryId and field
      const existingAlert = await prisma.alerts.findFirst({
        where: {
          entryId,
          alertDescription: {
            contains: fieldName, // Rough check for field-specific alert
          },
          alertStatus: 'UNRESOLVED',
        },
      });

      if (existingAlert) {
        return res.status(200).json({ message: 'Alert already exists', alert: existingAlert });
      }

      // Create new alert
      const alert = await prisma.alerts.create({
        data: {
          entryId,
          alertDescription,
          alertDate: new Date(),
          priority: priority || 'HIGH', // Default to HIGH if not provided
          feed: {
            connect: { entryId },
          },
        },
      });

      return res.status(201).json({ message: 'Alert created', alert });
    } catch (error) {
      console.error('Error creating alert:', error);
      return res.status(500).json({ error: 'Failed to create alert' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}