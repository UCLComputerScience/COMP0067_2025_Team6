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
            entryId: true,
            field1: true,
            field2: true,
            field3: true,
            field4: true,
            field5: true,
            field6: true,
            field7: true,
            field8: true,
            createdAt: true,
            channel: {
              select: {
                name: true,
                longitude: true,
                latitude: true,
                field1: true,
                field2: true,
                field3: true,
                field4: true,
                field5: true,
                field6: true,
                field7: true,
                field8: true,
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
        : [0, 0],
      channelId: alert.feed?.channelId ?? 0,
      channelName: alert.feed?.channel?.name ?? "Unknown",
      priority: alert.priority || 'LOW',
      alertDescription: alert.alertDescription,
      status: alert.alertStatus,
      date: alert.alertDate.toISOString(),
      feed: alert.feed
        ? {
            entryId: alert.feed.entryId,
            field1: alert.feed.field1,
            field2: alert.feed.field2,
            field3: alert.feed.field3,
            field4: alert.feed.field4,
            field5: alert.feed.field5,
            field6: alert.feed.field6,
            field7: alert.feed.field7,
            field8: alert.feed.field8,
            createdAt: alert.feed.createdAt.toISOString(),
          }
        : null,
      channelFields: alert.feed?.channel
        ? {
            field1: alert.feed.channel.field1,
            field2: alert.feed.channel.field2,
            field3: alert.feed.channel.field3,
            field4: alert.feed.channel.field4,
            field5: alert.feed.channel.field5,
            field6: alert.feed.channel.field6,
            field7: alert.feed.channel.field7,
            field8: alert.feed.channel.field8,
          }
        : null,
    }));

    console.log('API returning:', formattedAlerts);
    return NextResponse.json(formattedAlerts);
  } catch (error: unknown) {
    console.error('Error fetching alerts:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  }
}
