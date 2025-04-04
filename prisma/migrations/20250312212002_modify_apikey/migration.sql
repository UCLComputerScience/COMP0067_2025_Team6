/*
  Warnings:

  - Added the required column `channel_id` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN     "channel_id" INTEGER NOT NULL;
