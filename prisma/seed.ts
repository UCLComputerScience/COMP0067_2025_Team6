import { PrismaClient } from "@prisma/client";
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    // Get the current directory using import.meta.url
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // Read and parse the dummy_data.json file
    const jsonData = JSON.parse(
      fs.readFileSync(`${__dirname}/dummy_data.json`, 'utf-8')
    );


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

    // Insert Users
    await prisma.user.createMany({
      data: [
        {
          email: "stephen.hilton@example.com",
          password: "hashedpassword123", // Replace with a hashed password
          firstName: "Stephen",
          lastName: "Hilton",
          organisation: "Hilton Corp",
          role: "OWNER", // Change to "OWNER" if you've added that role
        },
        {
          email: "superuser@example.com",
          password: "hashedpassword123",
          firstName: "Super",
          lastName: "User",
          role: "SUPER_USER",
        },
        {
          email: "guest@example.com",
          password: "hashedpassword123",
          firstName: "Guest",
          lastName: "User",
          role: "TEMPORARY_USER",
        },
        {
          email: "standarduser@example.com",
          password: "hashedpassword123",
          firstName: "Standard",
          lastName: "User",
          role: "STANDARD_USER",
        },
      ],
    });

    console.log("Inserted dummy users.");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
