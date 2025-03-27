import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const userId = parseInt(req.query.userId as string);
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
                addressLine1: true,
                addressLine2: true,
                city: true,
                county: true,
                postcode: true,
                specialisation: true,
                description: true,
                userRole: true,
                avatar: true,
            },
        });
        

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            user: {
                ...user,
                specialisation: user.specialisation ?? [],
                role: user.userRole
            }
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
