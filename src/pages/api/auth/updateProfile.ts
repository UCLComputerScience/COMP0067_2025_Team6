import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const {
      userId,
      firstName,
      lastName,
      email,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      county,
      postcode,
      specialisation,
      description,
    } = req.body;

    const numericUserId = parseInt(userId as string, 10);
    if (isNaN(numericUserId)) {
      return res.status(400).json({ message: "Valid numeric User ID is required" });
    }

    const updateData: any = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (addressLine1 !== undefined) updateData.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) updateData.addressLine2 = addressLine2;
    if (city !== undefined) updateData.city = city;
    if (county !== undefined) updateData.county = county;
    if (postcode !== undefined) updateData.postcode = postcode;
    if (specialisation !== undefined) updateData.specialisation = specialisation;
    if (description !== undefined) updateData.description = description;

    const updatedUser = await prisma.user.update({
      where: { id: numericUserId },
      data: updateData,
    });

    return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
