import { PrismaClient } from "@prisma/client";
// import * as fs from "fs";


const prisma = new PrismaClient();
// const jsonData = JSON.parse(fs.readFileSync("dummy_data.json", "utf-8"));
import jsonData from "./dummy_data.json"

async function seedDatabase() {
  try {
    // Insert or update Channel
    const channel = await prisma.channel.upsert({
      where: { id: jsonData.channel.id },
      update: {},
      create: {
        id: jsonData.channel.id,
        name: jsonData.channel.name,
        latitude: parseFloat(jsonData.channel.latitude),
        longitude: parseFloat(jsonData.channel.longitude),
        field1: jsonData.channel.field1,
        field2: jsonData.channel.field2,
        field3: jsonData.channel.field3,
        lastEntryId: jsonData.channel.last_entry_id,
      },
    });

    console.log(`Inserted Channel: ${channel.name}`);

    // Insert Feeds
    const feeds = jsonData.feeds.map((feed: any) => ({
      entryId: feed.entry_id,
      createdAt: new Date(feed.created_at),
      field1: feed.field1 ? parseFloat(feed.field1) : null,
      field2: feed.field2 ? parseFloat(feed.field2) : null,
      field3: feed.field3 ? parseFloat(feed.field3) : null,
    }));

    await prisma.feed.createMany({ data: feeds });

    console.log(`Inserted ${feeds.length} feed records.`);
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();