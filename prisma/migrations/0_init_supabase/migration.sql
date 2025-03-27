-- CreateEnum
CREATE TYPE "alert_status" AS ENUM ('resolved', 'unresolved');

-- CreateEnum
CREATE TYPE "priority_type" AS ENUM ('high', 'moderate', 'low');

-- CreateEnum
CREATE TYPE "role" AS ENUM ('ADMIN', 'SUPER_USER', 'STANDARD_USER', 'TEMPORARY_USER');

-- CreateTable
CREATE TABLE "alerts" (
    "id" SERIAL NOT NULL,
    "entryid" INTEGER NOT NULL,
    "priority" "priority_type",
    "alertdescription" VARCHAR(255) NOT NULL,
    "alertstatus" "alert_status" NOT NULL,
    "alertdate" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "field1" VARCHAR(100),
    "field2" VARCHAR(100),
    "field3" VARCHAR(100),
    "field4" VARCHAR(100),
    "field5" VARCHAR(100),
    "field6" VARCHAR(100),
    "field7" VARCHAR(100),
    "field8" VARCHAR(100),
    "lastentryid" INTEGER NOT NULL,
    "createdat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feed" (
    "id" SERIAL NOT NULL,
    "channelid" INTEGER NOT NULL,
    "entryid" INTEGER NOT NULL,
    "createdat" TIMESTAMP(6) NOT NULL,
    "field1" DOUBLE PRECISION,
    "field2" DOUBLE PRECISION,
    "field3" DOUBLE PRECISION,
    "field4" VARCHAR(100),
    "field5" VARCHAR(100),
    "field6" VARCHAR(100),
    "field7" VARCHAR(100),
    "field8" VARCHAR(100),

    CONSTRAINT "feed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "labs" (
    "id" SERIAL NOT NULL,
    "lablocation" VARCHAR(100) NOT NULL,
    "managerid" INTEGER NOT NULL,

    CONSTRAINT "labs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "user_role" "role" NOT NULL DEFAULT 'STANDARD_USER',
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "firstname" VARCHAR(50) NOT NULL,
    "lastname" VARCHAR(50) NOT NULL,
    "organisation" VARCHAR(50),
    "avatar" VARCHAR(255),
    "resettoken" VARCHAR(255),
    "resettokenexpiry" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "phone_number" VARCHAR(15),
    "address_line_1" VARCHAR(255),
    "address_line_2" VARCHAR(255),
    "city" VARCHAR(100),
    "county" VARCHAR(100),
    "postcode" VARCHAR(20),
    "specialisation" VARCHAR(255),
    "description" VARCHAR(255),
    "organisation_role" VARCHAR(50),
    "organisation_email" VARCHAR(100),
    "organisation_phone_number" VARCHAR(15),
    "organisation_address_line_1" VARCHAR(255),
    "organisation_address_line_2" VARCHAR(255),
    "organisation_city" VARCHAR(100),
    "organisation_county" VARCHAR(100),
    "organisation_postcode" VARCHAR(20),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" SERIAL NOT NULL,
    "channel_id" INTEGER,
    "api" VARCHAR NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "feed_entryid_key" ON "feed"("entryid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_api_key" ON "ApiKey"("api");

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_entryid_fkey" FOREIGN KEY ("entryid") REFERENCES "feed"("entryid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feed" ADD CONSTRAINT "feed_channelid_fkey" FOREIGN KEY ("channelid") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "labs" ADD CONSTRAINT "labs_managerid_fkey" FOREIGN KEY ("managerid") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

