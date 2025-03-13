/*
  Warnings:

  - Added the required column `age` to the `Module` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "age" INTEGER NOT NULL;
