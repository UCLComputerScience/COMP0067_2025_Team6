/*
  Warnings:

  - A unique constraint covering the columns `[channelId,fieldName]` on the table `Threshold` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Threshold_channelId_fieldName_key" ON "Threshold"("channelId", "fieldName");
