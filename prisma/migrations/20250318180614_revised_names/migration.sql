/*
  Warnings:

  - You are about to drop the column `firstname` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `resettoken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `resettokenexpiry` on the `users` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('deactivated', 'activated');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "firstname",
DROP COLUMN "lastname",
DROP COLUMN "resettoken",
DROP COLUMN "resettokenexpiry",
ADD COLUMN     "firstName" VARCHAR(50) NOT NULL,
ADD COLUMN     "lastName" VARCHAR(50) NOT NULL,
ADD COLUMN     "resetToken" VARCHAR(255),
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(6),
ADD COLUMN     "status" "user_status" NOT NULL;
