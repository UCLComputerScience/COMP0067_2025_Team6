import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const {
            userId, firstName, lastName, email, phoneNumber,
            addressLine1, addressLine2, city, county, postcode,
            specialisation, description
        } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        //update user in database
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName,
                lastName,
                email,
                phoneNumber,
                addressLine1,
                addressLine2,
                city,
                county,
                postcode,
                specialisation: specialisation ?? [], 
                description
            }
        });

        return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Profile update error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
