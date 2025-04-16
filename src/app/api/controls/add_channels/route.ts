import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const {
    id,
    name,
    latitude,
    longitude,
    lastEntryId,
    createdAt,
    updatedAt,
    field1,
    field2,
    field3,
    field4,
    field5,
    field6,
    field7,
    field8,
    apiKey,
    labId,
  } = req.body;

  // Validate required fields
  if (!id || !name || latitude == null || longitude == null || lastEntryId == null || !apiKey) {
    return res.status(400).json({ message: 'Missing required fields: id, name, latitude, longitude, lastEntryId, and apiKey are required' });
  }

  // Validate data types
  if (typeof id !== 'number' || isNaN(latitude) || isNaN(longitude) || typeof lastEntryId !== 'number') {
    return res.status(400).json({ message: 'Invalid data types: id and lastEntryId must be numbers, latitude and longitude must be valid numbers' });
  }

  // Validate labId if provided
  if (labId && (typeof labId !== 'number' || labId <= 0)) {
    return res.status(400).json({ message: 'Invalid labId: must be a positive number' });
  }

  try {
    // Check for existing channel with the same ID
    const existingChannel = await prisma.channel.findUnique({
      where: { id },
    });
    if (existingChannel) {
      return res.status(409).json({ message: `Channel with ID ${id} already exists` });
    }

    // Check for existing API key
    const existingApiKey = await prisma.apiKey.findUnique({
      where: { api: apiKey },
    });
    if (existingApiKey) {
      return res.status(409).json({ message: 'API key already in use' });
    }

    // Validate labId exists if provided
    if (labId) {
      const existingLab = await prisma.labs.findUnique({
        where: { id: labId },
      });
      if (!existingLab) {
        return res.status(400).json({ message: `Lab with ID ${labId} does not exist` });
      }
    }

    const channel = await prisma.channel.create({
      data: {
        id,
        name,
        latitude,
        longitude,
        lastEntryId,
        createdAt: createdAt ? new Date(createdAt) : new Date(),
        updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
        field1: field1 || null,
        field2: field2 || null,
        field3: field3 || null,
        field4: field4 || null,
        field5: field5 || null,
        field6: field6 || null,
        field7: field7 || null,
        field8: field8 || null,
        ApiKey: {
          create: {
            api: apiKey,
            labId: labId || null,
          },
        },
      },
      include: { ApiKey: true },
    });

    return res.status(201).json(channel);
  } catch (error: any) {
    console.error('Error creating channel:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Channel ID or API key already exists' });
    }
    return res.status(500).json({ message: 'Failed to create channel' });
  } finally {
    await prisma.$disconnect();
  }
}