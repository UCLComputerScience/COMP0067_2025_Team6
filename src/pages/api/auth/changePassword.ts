import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token || !token.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "Missing new password" });
  }

  const user = await prisma.user.findUnique({
    where: { email: token.email },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email: token.email },
    data: { password: hashedPassword },
  });

  return res.status(200).json({ message: "Password updated successfully" });
}

