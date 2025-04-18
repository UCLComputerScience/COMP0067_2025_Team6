import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, action, device, location } = req.body;

    if (!userId || !action || !device || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const numericUserId = parseInt(userId);

    if (isNaN(numericUserId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const userRecord = await prisma.user.findUnique({
      where: { id: numericUserId },
      select: { firstName: true, lastName: true },
    });

    if (!userRecord) {
      return res.status(404).json({ error: 'User not found' });
    }

    const fullName = `${userRecord.firstName} ${userRecord.lastName}`;

    const log = await prisma.activityLog.create({
      data: {
        user: fullName,
        action,
        device,
        labLocation: location,
        timestamp: new Date(),
      },
    });

    res.status(201).json({ message: 'Activity logged', log });
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({ error: 'Failed to log activity' });
  }
}
