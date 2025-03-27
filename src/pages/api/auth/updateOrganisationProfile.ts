import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const {
            userId,
            organisation,
            organisationRole,
            organisationEmail,
            organisationPhoneNumber,
            organisationAddressLine1,
            organisationAddressLine2,
            organisationCity,
            organisationCounty,
            organisationPostcode,
        } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        //update organisation fields on the user
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                organisation,
                organisationRole,
                organisationEmail,
                organisationPhoneNumber,
                organisationAddressLine1,
                organisationAddressLine2,
                organisationCity,
                organisationCounty,
                organisationPostcode,
            },
            select: {
                id: true,
                organisation: true,
                organisationRole: true,
                organisationEmail: true,
                organisationPhoneNumber: true,
                organisationAddressLine1: true,
                organisationAddressLine2: true,
                organisationCity: true,
                organisationCounty: true,
                organisationPostcode: true,
            }
        });

        return res.status(200).json({
            message: "Organisation profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Organisation profile update error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
