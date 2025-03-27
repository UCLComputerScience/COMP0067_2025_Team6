/*
  Warnings:

  - The values [resolved,unresolved] on the enum `alertStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [high,moderate,low] on the enum `priorityType` will be removed. If these variants are still used in the database, this will fail.
  - The values [active,inactive] on the enum `userStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "alertStatus_new" AS ENUM ('RESOLVED', 'UNRESOLVED');
ALTER TABLE "Alerts" ALTER COLUMN "alertStatus" TYPE "alertStatus_new" USING ("alertStatus"::text::"alertStatus_new");
ALTER TYPE "alertStatus" RENAME TO "alertStatus_old";
ALTER TYPE "alertStatus_new" RENAME TO "alertStatus";
DROP TYPE "alertStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "priorityType_new" AS ENUM ('HIGH', 'MODERATE', 'LOW');
ALTER TABLE "Alerts" ALTER COLUMN "priority" TYPE "priorityType_new" USING ("priority"::text::"priorityType_new");
ALTER TYPE "priorityType" RENAME TO "priorityType_old";
ALTER TYPE "priorityType_new" RENAME TO "priorityType";
DROP TYPE "priorityType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "userStatus_new" AS ENUM ('ACTIVE', 'INACTIVE');
ALTER TABLE "Users" ALTER COLUMN "status" TYPE "userStatus_new" USING ("status"::text::"userStatus_new");
ALTER TYPE "userStatus" RENAME TO "userStatus_old";
ALTER TYPE "userStatus_new" RENAME TO "userStatus";
DROP TYPE "userStatus_old";
COMMIT;
