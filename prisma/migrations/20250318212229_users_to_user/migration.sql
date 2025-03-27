/*
  Warnings:

  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Labs" DROP CONSTRAINT "Labs_managerId_fkey";

-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userRole" "role" NOT NULL DEFAULT 'STANDARD_USER',
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "organisation" VARCHAR(50),
    "avatar" VARCHAR(255),
    "resetToken" VARCHAR(255),
    "resetTokenExpiry" TIMESTAMP(6),
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "phoneNumber" VARCHAR(15),
    "addressLine1" VARCHAR(255),
    "addressLine2" VARCHAR(255),
    "city" VARCHAR(100),
    "county" VARCHAR(100),
    "postcode" VARCHAR(20),
    "specialisation" VARCHAR(255),
    "description" VARCHAR(255),
    "organisationRole" VARCHAR(50),
    "organisationEmail" VARCHAR(100),
    "organisationPhoneNumber" VARCHAR(15),
    "organisationAddressLine1" VARCHAR(255),
    "organisationAddressLine2" VARCHAR(255),
    "organisationCity" VARCHAR(100),
    "organisationCounty" VARCHAR(100),
    "organisationPostcode" VARCHAR(20),
    "status" "userStatus" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Labs" ADD CONSTRAINT "Labs_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
