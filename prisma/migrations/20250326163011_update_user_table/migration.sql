/*
  Warnings:

  - You are about to drop the column `channel_id` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to alter the column `field1` on the `Channel` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `field2` on the `Channel` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `field3` on the `Channel` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the column `user_role` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `firstName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `avatar` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `lastName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `organisation` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `resetToken` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Added the required column `channelId` to the `Feed` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `firstName` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('RESOLVED', 'UNRESOLVED');

-- CreateEnum
CREATE TYPE "PriorityType" AS ENUM ('HIGH', 'MODERATE', 'LOW');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUPER_USER', 'STANDARD_USER', 'TEMPORARY_USER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "channel_id",
ADD COLUMN     "channelId" INTEGER,
ALTER COLUMN "api" SET DATA TYPE VARCHAR;

-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "field4" VARCHAR(100),
ADD COLUMN     "field5" VARCHAR(100),
ADD COLUMN     "field6" VARCHAR(100),
ADD COLUMN     "field7" VARCHAR(100),
ADD COLUMN     "field8" VARCHAR(100),
ALTER COLUMN "name" SET DATA TYPE VARCHAR,
ALTER COLUMN "field1" DROP NOT NULL,
ALTER COLUMN "field1" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "field2" DROP NOT NULL,
ALTER COLUMN "field2" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "field3" DROP NOT NULL,
ALTER COLUMN "field3" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(6);

-- AlterTable
ALTER TABLE "Feed" ADD COLUMN     "channelId" INTEGER NOT NULL,
ADD COLUMN     "field4" VARCHAR(100),
ADD COLUMN     "field5" VARCHAR(100),
ADD COLUMN     "field6" VARCHAR(100),
ADD COLUMN     "field7" VARCHAR(100),
ADD COLUMN     "field8" VARCHAR(100),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(6);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "user_role",
ADD COLUMN     "addressLine1" VARCHAR(255),
ADD COLUMN     "addressLine2" VARCHAR(255),
ADD COLUMN     "city" VARCHAR(100),
ADD COLUMN     "county" VARCHAR(100),
ADD COLUMN     "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" VARCHAR(255),
ADD COLUMN     "organisationAddressLine1" VARCHAR(255),
ADD COLUMN     "organisationAddressLine2" VARCHAR(255),
ADD COLUMN     "organisationCity" VARCHAR(100),
ADD COLUMN     "organisationCounty" VARCHAR(100),
ADD COLUMN     "organisationEmail" VARCHAR(100),
ADD COLUMN     "organisationPhoneNumber" VARCHAR(15),
ADD COLUMN     "organisationPostcode" VARCHAR(20),
ADD COLUMN     "organisationRole" VARCHAR(50),
ADD COLUMN     "phoneNumber" VARCHAR(15),
ADD COLUMN     "postcode" VARCHAR(20),
ADD COLUMN     "specialisation" VARCHAR(255),
ADD COLUMN     "status" "UserStatus" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userRole" "Role" NOT NULL DEFAULT 'STANDARD_USER',
ALTER COLUMN "email" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "firstName" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "avatar" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "lastName" SET NOT NULL,
ALTER COLUMN "lastName" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "organisation" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "resetToken" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "resetTokenExpiry" SET DATA TYPE TIMESTAMP(6);

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "Alerts" (
    "id" SERIAL NOT NULL,
    "entryId" INTEGER NOT NULL,
    "priority" "PriorityType",
    "alertDescription" VARCHAR(255) NOT NULL,
    "alertStatus" "AlertStatus" NOT NULL,
    "alertDate" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Labs" (
    "id" SERIAL NOT NULL,
    "labLocation" VARCHAR(100) NOT NULL,
    "managerId" INTEGER NOT NULL,

    CONSTRAINT "Labs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Alerts" ADD CONSTRAINT "Alerts_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Feed"("entryId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Feed" ADD CONSTRAINT "Feed_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Labs" ADD CONSTRAINT "Labs_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
