-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" SERIAL NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "user" VARCHAR(100) NOT NULL,
    "labLocation" VARCHAR(100) NOT NULL,
    "device" VARCHAR(100),
    "timestamp" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);
