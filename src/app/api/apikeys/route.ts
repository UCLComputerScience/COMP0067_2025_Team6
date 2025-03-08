import { NextResponse } from "next/server";

import prisma from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { api } = await req.json();

    if (!api) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newApi = await prisma.apiKey.create({
      data: { api },
    });

    return NextResponse.json(newApi, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save API" }, { status: 500 });
  }
}
