/*
  Warnings:

  - You are about to drop the `APIkey` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "APIkey";

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" SERIAL NOT NULL,
    "api" TEXT NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_api_key" ON "ApiKey"("api");
