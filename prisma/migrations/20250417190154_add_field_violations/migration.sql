-- AlterTable
ALTER TABLE "Alerts" ADD COLUMN     "fieldViolations" TEXT[] DEFAULT ARRAY[]::TEXT[];
