// import { PrismaClient } from "@prisma/client";
// import { NextRequest, NextResponse } from "next/server";

// const prisma = new PrismaClient();

// export async function GET(req: NextRequest) {
//   console.log('Server-side DATABASE_URL:', process.env.DATABASE_URL);
//   try {
//     const channels = await prisma.channel.findMany({
//       include: {
//         ApiKey: {
//           include: {
//             lab: true, 
//           },
//         },
//       },
//     });

//     return NextResponse.json(channels, { status: 200 });
//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json(
//       { message: "Internal server error", error: error.message },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }


// app/api/controls/channels/route.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  console.log("Server-side DATABASE_URL:", process.env.DATABASE_URL);

  try {
    // Extract userId from query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "Missing userId query parameter" },
        { status: 400 }
      );
    }

    // Fetch channels for the user
    const channels = await prisma.channel.findMany({
      where: {
        ApiKey: {
          some: {
            lab: {
              managerId: userId, // Filter by userId via lab's managerId
            },
          },
        },
      },
      include: {
        ApiKey: {
          include: {
            lab: true,
          },
        },
      },
    });

    return NextResponse.json(channels, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}