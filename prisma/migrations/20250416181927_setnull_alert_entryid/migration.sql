-- DropForeignKey
ALTER TABLE "Alerts" DROP CONSTRAINT "Alerts_entryId_fkey";

-- AlterTable
ALTER TABLE "Alerts" ALTER COLUMN "entryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Alerts" ADD CONSTRAINT "Alerts_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Feed"("entryId") ON DELETE SET NULL ON UPDATE NO ACTION;
