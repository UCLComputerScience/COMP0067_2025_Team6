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

        const organisation = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                organisation: true,
                organisationRole: true,
                organisationEmail: true,
                organisationPhoneNumber: true,
                organisationAddressLine1: true,
                organisationAddressLine2: true,
                organisationCity: true,
                organisationCounty: true,
                organisationPostcode: true,
            },
        });

        if (!organisation) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user: organisation });
    } catch (error) {
        console.error("Error fetching organisation profile:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
