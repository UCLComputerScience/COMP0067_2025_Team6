import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";  // Importing the existing Prisma instance

export async function GET() {
  try {
    // Fetching alerts with channel info (longitude and latitude)
    const alertsWithChannelInfo = await prisma.alerts.findMany({
      select: {
        id: true,
        entryid: true,
        priority: true,
        alertdescription: true,
        alertstatus: true,
        alertdate: true,
        feed: {
          select: {
            channelid: true,
            channel: {
              select: {
                longitude: true,
                latitude: true,
              },
            },
          },
        },
      },
      orderBy: {
        alertdate: 'desc',
      },
    });

    // Mapping the results to match the desired structure
    const formattedAlerts = alertsWithChannelInfo.map(alert => ({
      alertid: alert.id,
      location: [
        alert.feed.channel.longitude,
        alert.feed.channel.latitude
      ],
      channelid: alert.feed.channelid,
      priority: alert.priority,
      alertdescription: alert.alertdescription,
      status: alert.alertstatus,
      date: alert.alertdate
    }));

    // Returning the formatted data as JSON
    return NextResponse.json(formattedAlerts);
    
  } catch (error) {
    console.error("Error fetching alerts:", error);
    console.error("Detailed error:", error.message);  // Log the error message
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}
