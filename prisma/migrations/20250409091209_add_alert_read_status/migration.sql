/*
  Warnings:

  - Added the required column `readStatus` to the `Alerts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReadStatus" AS ENUM ('READ', 'UNREAD');

-- AlterTable
ALTER TABLE "Alerts" ADD COLUMN     "readStatus" "ReadStatus" NOT NULL;
