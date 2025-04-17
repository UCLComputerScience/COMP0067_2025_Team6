/*
  Warnings:

  - You are about to drop the column `labId` on the `Access` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,channelId]` on the table `Access` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Access" DROP CONSTRAINT "Access_labId_fkey";

-- DropIndex
DROP INDEX "Access_labId_idx";

-- DropIndex
DROP INDEX "Access_userId_labId_channelId_key";

-- AlterTable
ALTER TABLE "Access" DROP COLUMN "labId";

-- CreateIndex
CREATE UNIQUE INDEX "Access_userId_channelId_key" ON "Access"("userId", "channelId");
