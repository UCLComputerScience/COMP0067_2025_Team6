/*
  Warnings:

  - A unique constraint covering the columns `[fieldName]` on the table `DefaultThreshold` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DefaultThreshold_fieldName_key" ON "DefaultThreshold"("fieldName");
