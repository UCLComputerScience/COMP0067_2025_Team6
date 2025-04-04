/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPER_USER', 'STANDARD_USER', 'TEMPORARY_USER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "user_role" "UserRole" NOT NULL DEFAULT 'STANDARD_USER';

-- DropEnum
DROP TYPE "Role";
