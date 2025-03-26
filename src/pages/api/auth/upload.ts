import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

const uploadDir = path.join(process.cwd(), "/public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const form = formidable({ uploadDir, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      return res.status(500).json({ message: "Error processing upload" });
    }

    const userId = parseInt(fields.userId as string);
    if (!userId || !files.avatar) {
      return res.status(400).json({ message: "User ID and avatar file are required" });
    }

    const avatarFile = Array.isArray(files.avatar) ? files.avatar[0] : files.avatar;
    const avatarPath = "/uploads/" + path.basename(avatarFile.filepath);

    try {
      await prisma.user.update({
        where: { id: userId },
        data: { avatar: avatarPath },
      });
      return res.status(200).json({ message: "Avatar updated", avatarUrl: avatarPath });
    } catch (error) {
      console.error("Database update error:", error);
      return res.status(500).json({ message: "Failed to update avatar" });
    }
  });
}
