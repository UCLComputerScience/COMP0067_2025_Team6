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

    const numericUserId = parseInt(userId as string, 10);
    if (isNaN(numericUserId)) {
      return res.status(400).json({ message: "Valid User ID is required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: numericUserId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateData: any = {};

    if (organisation !== undefined) updateData.organisation = organisation;
    if (organisationRole !== undefined) updateData.organisationRole = organisationRole;
    if (organisationEmail !== undefined) updateData.organisationEmail = organisationEmail;
    if (organisationPhoneNumber !== undefined) updateData.organisationPhoneNumber = organisationPhoneNumber;
    if (organisationAddressLine1 !== undefined) updateData.organisationAddressLine1 = organisationAddressLine1;
    if (organisationAddressLine2 !== undefined) updateData.organisationAddressLine2 = organisationAddressLine2;
    if (organisationCity !== undefined) updateData.organisationCity = organisationCity;
    if (organisationCounty !== undefined) updateData.organisationCounty = organisationCounty;
    if (organisationPostcode !== undefined) updateData.organisationPostcode = organisationPostcode;

    const updatedUser = await prisma.user.update({
      where: { id: numericUserId },
      data: updateData,
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
      },
    });

    return res.status(200).json({
      message: "Organisation profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Organisation profile update error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
