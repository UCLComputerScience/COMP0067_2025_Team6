import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt"; // Use getToken from next-auth/jwt

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Get JWT token from the request (from Authorization header)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token || !token.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "Missing new password" });
  }

  // Get user from the database using email from the session token
  const user = await prisma.user.findUnique({
    where: { email: token.email },
  });

  if (!user || !user.password) {
    return res.status(404).json({ message: "User not found" });
  }

  // Save the new password (no hashing)
  await prisma.user.update({
    where: { email: token.email },
    data: { password: newPassword },
  });

  return res.status(200).json({ message: "Password updated successfully" });
}

