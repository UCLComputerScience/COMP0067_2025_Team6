import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { channelId, fieldViolations, alertDescription, priority, alertStatus, feedData } =
      await req.json();

    // Validate required fields
    if (!channelId || !fieldViolations || !fieldViolations.length || !alertDescription || !feedData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch channel and generate new entryId
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      select: { lastEntryId: true },
    });

    if (!channel) {
      return NextResponse.json({ error: "Channel not found" }, { status: 404 });
    }

    // Calculate newEntryId by incrementing lastEntryId
    const newEntryId = channel.lastEntryId + 1;

    // Check for existing unresolved alerts
    const existingAlerts = await prisma.alerts.findMany({
      where: {
        feed: { channelId: channelId },
        alertStatus: "UNRESOLVED",
      },
      select: {
        id: true,
        alertDescription: true,
        fieldViolations: true, // Include fieldViolations
      },
    });

    // Get all fields covered by existing unresolved alerts
    const existingViolationFields = new Set(
      existingAlerts.flatMap(alert => alert.fieldViolations)
    );

    // Check if any incoming fieldViolations are new
    const newViolations = fieldViolations.filter(
      (field: string) => !existingViolationFields.has(field)
    );

    // If no new violations, return existing alerts
    if (newViolations.length === 0 && existingAlerts.length > 0) {
      return NextResponse.json(
        {
          message: `Unresolved alerts already exist for fields: ${fieldViolations.join(", ")}`,
          alerts: existingAlerts,
        },
        { status: 200 }
      );
    }

    // Create Feed first
    const newFeed = await prisma.feed.create({
      data: {
        channelId: channelId,
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
    });

    // Create Alert and update Channel in a transaction
    const [updatedChannel, newAlert] = await prisma.$transaction([
      prisma.channel.update({
        where: { id: channelId },
        data: { lastEntryId: newEntryId },
      }),
      prisma.alerts.create({
        data: {
          feedId: newFeed.id,
          alertDescription,
          alertDate: new Date(),
          priority: priority || "HIGH",
          alertStatus: alertStatus || "UNRESOLVED",
          fieldViolations: fieldViolations, // Store fieldViolations
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
