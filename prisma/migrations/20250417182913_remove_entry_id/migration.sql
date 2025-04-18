/*
  Warnings:

  - You are about to drop the column `entryId` on the `Alerts` table. All the data in the column will be lost.
  - You are about to drop the column `entryId` on the `Feed` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Alerts" DROP CONSTRAINT "Alerts_entryId_fkey";

-- DropIndex
DROP INDEX "Feed_entryId_key";

-- AlterTable
ALTER TABLE "Alerts" DROP COLUMN "entryId",
ADD COLUMN     "feedId" INTEGER;

-- AlterTable
ALTER TABLE "Feed" DROP COLUMN "entryId";

-- AddForeignKey
ALTER TABLE "Alerts" ADD CONSTRAINT "Alerts_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "Feed"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
