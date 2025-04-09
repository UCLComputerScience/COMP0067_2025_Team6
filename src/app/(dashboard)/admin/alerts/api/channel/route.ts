// import { NextResponse } from "next/server";
//  import prisma from "@/lib/prisma";  // Importing the existing Prisma instance
 
//  export async function GET() {
//    try {
//      // Fetching alerts with channel info (longitude and latitude)
//      const alertsWithChannelInfo = await prisma.alerts.findMany({
//        select: {
//          id: true,
//          entryId: true,
//          priority: true,
//          alertDescription: true,
//          alertStatus: true,
//          alertDate: true,
//          feed: {
//            select: {
//              channelId: true,
//              channel: {
//                select: {
//                  longitude: true,
//                  latitude: true,
//                },
//              },
//            },
//          },
//        },
//        orderBy: {
//          alertDate: 'desc',
//        },
//      });
 
//      // Mapping the results to match the desired structure
//      const formattedAlerts = alertsWithChannelInfo.map(alert => ({
//        alertId: alert.id,
//        location: [
//          alert.feed.channel.longitude,
//          alert.feed.channel.latitude
//        ],
//        channelId: alert.feed.channelId,
//        priority: alert.priority,
//        alertDescription: alert.alertDescription,
//        status: alert.alertStatus,
//        date: alert.alertDate
//      }));
 
//      // Returning the formatted data as JSON
//      return NextResponse.json(formattedAlerts);
     
//     } catch (error: unknown) {
//       console.error("Error fetching alerts:", error);
//       const errorMessage = error instanceof Error ? error.message : String(error);
//       console.error("Detailed error:", errorMessage);
//       return NextResponse.json({ message: "Internal Server Error", error: errorMessage }, { status: 500 });
//     }
//  }

// src/app/(dashboard)/admin/alerts/api/channel/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const alertsWithChannelInfo = await prisma.alerts.findMany({
      select: {
        id: true,
        entryId: true,
        priority: true,
        alertDescription: true,
        alertStatus: true,
        alertDate: true,
        feed: {
          select: {
            channelId: true,
            channel: {
              select: {
                name: true,
                longitude: true,
                latitude: true,
              },
            },
          },
        },
      },
      orderBy: { alertDate: 'desc' },
    });

    const formattedAlerts = alertsWithChannelInfo.map(alert => ({
      alertId: alert.id,
      location: alert.feed?.channel
        ? [alert.feed.channel.latitude ?? 0, alert.feed.channel.longitude ?? 0]
        : [0, 0], // Fallback for missing feed/channel
      channelId: alert.feed?.channelId ?? 0,
      channelName: alert.feed?.channel?.name ?? "Unknown",
      priority: alert.priority || 'LOW',
      alertDescription: alert.alertDescription,
      status: alert.alertStatus,
      date: alert.alertDate.toISOString(), // Ensure consistent string format
    }));

    console.log('API returning:', formattedAlerts); // Log server-side output
    return NextResponse.json(formattedAlerts);
  } catch (error: unknown) {
    console.error('Error fetching alerts:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  }
}