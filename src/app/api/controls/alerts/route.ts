// import { NextApiRequest, NextApiResponse } from 'next';
// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// // const prisma = new PrismaClient();
// import prisma from "../../../../lib/prisma";


// // export default async function handler(req: NextApiRequest, res: NextApiResponse) {
// //   if (req.method === 'POST') {
// //     try {
// //       const { entryId, channelId, fieldName, alertDescription, priority } = req.body;

// //       // Validate required fields
// //       if (!entryId || !channelId || !fieldName || !alertDescription) {
// //         return res.status(400).json({ error: 'Missing required fields' });
// //       }

// //       // Check if an unresolved alert already exists for this entryId and field
// //       const existingAlert = await prisma.alerts.findFirst({
// //         where: {
// //           entryId,
// //           alertDescription: {
// //             contains: fieldName, // Rough check for field-specific alert
// //           },
// //           alertStatus: 'UNRESOLVED',
// //         },
// //       });

// //       if (existingAlert) {
// //         return res.status(200).json({ message: 'Alert already exists', alert: existingAlert });
// //       }

// //       // Create new alert
// //       const alert = await prisma.alerts.create({
// //         data: {
// //           entryId,
// //           alertDescription,
// //           alertDate: new Date(),
// //           priority: priority || 'HIGH', // Default to HIGH if not provided
// //           feed: {
// //             connect: { entryId },
// //           },
// //         },
// //       });

// //       return res.status(201).json({ message: 'Alert created', alert });
// //     } catch (error) {
// //       console.error('Error creating alert:', error);
// //       return res.status(500).json({ error: 'Failed to create alert' });
// //     }
// //   } else {
// //     res.setHeader('Allow', ['POST']);
// //     return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
// //   }
// // }

// export async function POST(req: NextRequest) {
//   try {
//     const { entryId, channelId, fieldName, alertDescription, priority } = await req.json();

//     if (!entryId || !channelId || !fieldName || !alertDescription) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     const existingAlert = await prisma.alerts.findFirst({
//       where: {
//         entryId,
//         alertDescription: {
//           contains: fieldName,
//         },
//         alertStatus: 'UNRESOLVED',
//       },
//     });

//     if (existingAlert) {
//       return NextResponse.json({ message: 'Alert already exists', alert: existingAlert }, { status: 200 });
//     }

//     const alert = await prisma.alerts.create({
//       data: {
//         entryId,
//         alertDescription,
//         alertDate: new Date(),
//         priority: priority || 'HIGH',
//         feed: {
//           connect: { entryId },
//         },
//       },
//     });

//     return NextResponse.json({ message: 'Alert created', alert }, { status: 201 });
//   } catch (error) {
//     console.error('Error creating alert:', error);
//     return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { channelId, fieldName, alertDescription, priority, alertStatus, feedData } =
      await req.json();

    // Validate required fields
    if (!channelId || !fieldName || !alertDescription || !feedData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate a unique entryId
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      select: { lastEntryId: true },
    });

    if (!channel) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    const newEntryId = channel.lastEntryId + 1;

    // Create Feed and Alert in a transaction
    const [newFeed, updatedChannel, newAlert] = await prisma.$transaction([
      prisma.feed.create({
        data: {
          channelId: channelId,
          entryId: newEntryId,
          createdAt: new Date(),
          field1: feedData.field1 ?? null,
          field2: feedData.field2 ?? null,
          field3: feedData.field3 ?? null,
          field4: feedData.field4 ?? null,
          field5: feedData.field5 ?? null,
          field6: feedData.field6 ?? null,
          field7: feedData.field7 ?? null,
          field8: feedData.field8 ?? null,
        },
      }),
      prisma.channel.update({
        where: { id: channelId },
        data: { lastEntryId: newEntryId },
      }),
      prisma.alerts.create({
        data: {
          entryId: newEntryId,
          alertDescription,
          alertDate: new Date(),
          priority: priority || "HIGH",
          alertStatus: alertStatus || "UNRESOLVED",
          feed: {
            connect: { entryId: newEntryId },
          },
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Feed and Alert created", feed: newFeed, alert: newAlert },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating feed/alert:", error);
    return NextResponse.json(
      { error: "Failed to create feed/alert", details: error.message },
      { status: 500 }
    );
  }
}