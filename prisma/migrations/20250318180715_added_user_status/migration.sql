/*
  Warnings:

  - The values [deactivated,activated] on the enum `user_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "user_status_new" AS ENUM ('active', 'inactive');
ALTER TABLE "users" ALTER COLUMN "status" TYPE "user_status_new" USING ("status"::text::"user_status_new");
ALTER TYPE "user_status" RENAME TO "user_status_old";
ALTER TYPE "user_status_new" RENAME TO "user_status";
DROP TYPE "user_status_old";
COMMIT;
