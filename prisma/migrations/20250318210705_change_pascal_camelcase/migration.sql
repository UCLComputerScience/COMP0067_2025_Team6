/*
  Warnings:

  - You are about to drop the column `channel_id` on the `ApiKey` table. All the data in the column will be lost.
  - You are about to drop the column `address_line_1` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `address_line_2` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `organisation_address_line_1` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `organisation_address_line_2` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `organisation_city` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `organisation_county` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `organisation_email` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `organisation_phone_number` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `organisation_postcode` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `organisation_role` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `user_role` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `alerts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `channel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `feed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `labs` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `status` on the `Users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "alertStatus" AS ENUM ('resolved', 'unresolved');

-- CreateEnum
CREATE TYPE "priorityType" AS ENUM ('high', 'moderate', 'low');

-- CreateEnum
CREATE TYPE "userStatus" AS ENUM ('active', 'inactive');

-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_channel_id_fkey";

-- DropForeignKey
ALTER TABLE "alerts" DROP CONSTRAINT "alerts_entryid_fkey";

-- DropForeignKey
ALTER TABLE "feed" DROP CONSTRAINT "feed_channelid_fkey";

-- DropForeignKey
ALTER TABLE "labs" DROP CONSTRAINT "labs_managerid_fkey";

-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "channel_id",
ADD COLUMN     "channelId" INTEGER;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "address_line_1",
DROP COLUMN "address_line_2",
DROP COLUMN "created_at",
DROP COLUMN "organisation_address_line_1",
DROP COLUMN "organisation_address_line_2",
DROP COLUMN "organisation_city",
DROP COLUMN "organisation_county",
DROP COLUMN "organisation_email",
DROP COLUMN "organisation_phone_number",
DROP COLUMN "organisation_postcode",
DROP COLUMN "organisation_role",
DROP COLUMN "phone_number",
DROP COLUMN "updated_at",
DROP COLUMN "user_role",
ADD COLUMN     "addressLine1" VARCHAR(255),
ADD COLUMN     "addressLine2" VARCHAR(255),
ADD COLUMN     "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "organisationAddressLine1" VARCHAR(255),
ADD COLUMN     "organisationAddressLine2" VARCHAR(255),
ADD COLUMN     "organisationCity" VARCHAR(100),
ADD COLUMN     "organisationCounty" VARCHAR(100),
ADD COLUMN     "organisationEmail" VARCHAR(100),
ADD COLUMN     "organisationPhoneNumber" VARCHAR(15),
ADD COLUMN     "organisationPostcode" VARCHAR(20),
ADD COLUMN     "organisationRole" VARCHAR(50),
ADD COLUMN     "phoneNumber" VARCHAR(15),
ADD COLUMN     "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userRole" "role" NOT NULL DEFAULT 'STANDARD_USER',
DROP COLUMN "status",
ADD COLUMN     "status" "userStatus" NOT NULL;

-- DropTable
DROP TABLE "alerts";

-- DropTable
DROP TABLE "channel";

-- DropTable
DROP TABLE "feed";

-- DropTable
DROP TABLE "labs";

-- DropEnum
DROP TYPE "alert_status";

-- DropEnum
DROP TYPE "priority_type";

-- DropEnum
DROP TYPE "user_status";

-- CreateTable
CREATE TABLE "Alerts" (
    "id" SERIAL NOT NULL,
    "entryId" INTEGER NOT NULL,
    "priority" "priorityType",
    "alertDescription" VARCHAR(255) NOT NULL,
    "alertStatus" "alertStatus" NOT NULL,
    "alertDate" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "field1" VARCHAR(100),
    "field2" VARCHAR(100),
    "field3" VARCHAR(100),
    "field4" VARCHAR(100),
    "field5" VARCHAR(100),
    "field6" VARCHAR(100),
    "field7" VARCHAR(100),
    "field8" VARCHAR(100),
    "lastEntryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feed" (
    "id" SERIAL NOT NULL,
    "channelId" INTEGER NOT NULL,
    "entryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL,
    "field1" DOUBLE PRECISION,
    "field2" DOUBLE PRECISION,
    "field3" DOUBLE PRECISION,
    "field4" VARCHAR(100),
    "field5" VARCHAR(100),
    "field6" VARCHAR(100),
    "field7" VARCHAR(100),
    "field8" VARCHAR(100),

    CONSTRAINT "Feed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Labs" (
    "id" SERIAL NOT NULL,
    "labLocation" VARCHAR(100) NOT NULL,
    "managerId" INTEGER NOT NULL,

    CONSTRAINT "Labs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Feed_entryId_key" ON "Feed"("entryId");

-- AddForeignKey
ALTER TABLE "Alerts" ADD CONSTRAINT "Alerts_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Feed"("entryId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Feed" ADD CONSTRAINT "Feed_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Labs" ADD CONSTRAINT "Labs_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
