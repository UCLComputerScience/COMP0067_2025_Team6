// import { PrismaClient } from "@prisma/client";
// import { NextRequest, NextResponse } from "next/server";

// const prisma = new PrismaClient();

// export async function POST(req: NextRequest) {
//   try {
//     const { channelId, thresholds } = await req.json();
//     console.log("POST /api/controls/thresholds - Payload:", { channelId, thresholds });

//     if (!channelId || isNaN(Number(channelId))) {
//       return NextResponse.json(
//         { error: "Invalid channelId" },
//         { status: 400 }
//       );
//     }

//     if (!Array.isArray(thresholds)) {
//       return NextResponse.json(
//         { error: "Thresholds must be an array" },
//         { status: 400 }
//       );
//     }

//     if (thresholds.length === 0) {
//       await prisma.threshold.deleteMany({
//         where: { channelId: Number(channelId) },
//       });
//       console.log(`POST /api/controls/thresholds - Cleared thresholds for channelId=${channelId}`);
//       return NextResponse.json({ thresholds: [] }, { status: 200 });
//     }

//     // Validate thresholds
//     const invalidThresholds = thresholds.filter(
//       (t: any) =>
//         !t.fieldName ||
//         t.minValue == null ||
//         t.maxValue == null ||
//         isNaN(Number(t.minValue)) ||
//         isNaN(Number(t.maxValue)) ||
//         Number(t.minValue) >= Number(t.maxValue)
//     );
//     if (invalidThresholds.length > 0) {
//       console.log("POST /api/controls/thresholds - Invalid thresholds:", invalidThresholds);
//       return NextResponse.json(
//         {
//           error:
//             "Invalid threshold data: fieldName, minValue, and maxValue required, with minValue < maxValue",
//         },
//         { status: 400 }
//       );
//     }

//     // Upsert thresholds
//     const upsertPromises = thresholds.map((threshold: any) =>
//       prisma.threshold.upsert({
//         where: {
//           channelId_fieldName: {
//             channelId: Number(channelId),
//             fieldName: threshold.fieldName,
//           },
//         },
//         update: {
//           minValue: Number(threshold.minValue),
//           maxValue: Number(threshold.maxValue),
//           unit: threshold.unit || null,
//           updatedAt: new Date(), // Optional: Explicitly set updatedAt
//         },
//         create: {
//           channelId: Number(channelId),
//           fieldName: threshold.fieldName,
//           minValue: Number(threshold.minValue),
//           maxValue: Number(threshold.maxValue),
//           unit: threshold.unit || null,
//           createdAt: new Date(), // Optional: Explicitly set createdAt
//         },
//       })
//     );

//     const updatedThresholds = await Promise.all(upsertPromises);
//     console.log(`POST /api/controls/thresholds - Updated ${updatedThresholds.length} thresholds for channelId=${channelId}`);
//     return NextResponse.json({ thresholds: updatedThresholds }, { status: 200 });
//   } catch (error: any) {
//     console.error("POST /api/controls/thresholds - Error:", error);
//     return NextResponse.json(
//       { error: `Failed to save thresholds: ${error.message}` },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }