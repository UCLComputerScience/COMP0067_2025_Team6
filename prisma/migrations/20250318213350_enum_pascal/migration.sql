/*
  Warnings:

  - The `priority` column on the `Alerts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `userRole` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `alertStatus` on the `Alerts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('RESOLVED', 'UNRESOLVED');

-- CreateEnum
CREATE TYPE "PriorityType" AS ENUM ('HIGH', 'MODERATE', 'LOW');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUPER_USER', 'STANDARD_USER', 'TEMPORARY_USER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Alerts" DROP COLUMN "priority",
ADD COLUMN     "priority" "PriorityType",
DROP COLUMN "alertStatus",
ADD COLUMN     "alertStatus" "AlertStatus" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userRole",
ADD COLUMN     "userRole" "Role" NOT NULL DEFAULT 'STANDARD_USER',
DROP COLUMN "status",
ADD COLUMN     "status" "UserStatus" NOT NULL;

-- DropEnum
DROP TYPE "alertStatus";

-- DropEnum
DROP TYPE "priorityType";

-- DropEnum
DROP TYPE "role";

-- DropEnum
DROP TYPE "userStatus";
