import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import cors from 'cors';

const corsMiddleware = cors({
  origin: ['http://localhost:3000'],
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorisation']
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await new Promise((resolve, reject) => {
    corsMiddleware(req, res, (err) => {
      if (err) return reject(err);
      resolve(true);
    });
  });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { email, password, firstName, lastName, organisation, avatar } = req.body;

    //validate input
    if (!email || !password || !firstName || !organisation) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    //check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //create new user in database
    const newUser = await prisma.user.create({
        data: {
            email,
            password,
            firstName,
            lastName,
            organisation,
            avatar: avatar || "https://example.com/default-avatar.png", //default avatar
            userRole: "STANDARD_USER",
            status: "ACTIVE", // default status
          },
        });

    return res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}