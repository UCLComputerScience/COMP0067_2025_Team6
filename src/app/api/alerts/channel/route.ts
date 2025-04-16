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