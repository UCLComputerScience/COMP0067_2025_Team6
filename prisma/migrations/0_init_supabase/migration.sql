-- CreateEnum
CREATE TYPE "access_level" AS ENUM ('read-only', 'editor', 'admin');

-- CreateEnum
CREATE TYPE "access_status" AS ENUM ('active', 'inactive', 'pending', 'revoked');

-- CreateEnum
CREATE TYPE "alert_status" AS ENUM ('resolved', 'unresolved');

-- CreateEnum
CREATE TYPE "instrument_status" AS ENUM ('available', 'in-use', 'inactive');

-- CreateEnum
CREATE TYPE "priority_type" AS ENUM ('high', 'moderate', 'low');

-- CreateEnum
CREATE TYPE "project_status" AS ENUM ('pending', 'approved', 'in progress', 'completed', 'rejected');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('ADMIN', 'SUPER_USER', 'STANDARD_USER', 'TEMPORARY_USER');

-- CreateTable
CREATE TABLE "alerts" (
    "id" SERIAL NOT NULL,
    "serialnumber" INTEGER NOT NULL,
    "priority" "priority_type",
    "alertdescription" VARCHAR(255) NOT NULL,
    "alertstatus" "alert_status" NOT NULL,
    "alertdate" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apikey" (
    "id" SERIAL NOT NULL,
    "api" VARCHAR NOT NULL,

    CONSTRAINT "apikey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "field1" VARCHAR(100),
    "field2" VARCHAR(100),
    "field3" VARCHAR(100),
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

    CONSTRAINT "feed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "contentid" INTEGER NOT NULL,
    "imageurl" VARCHAR(255) NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instrumentaccess" (
    "userid" INTEGER NOT NULL,
    "serialnumber" INTEGER NOT NULL,

    CONSTRAINT "instrumentaccess_pkey" PRIMARY KEY ("userid","serialnumber")
);

-- CreateTable
CREATE TABLE "instrumentdata" (
    "id" SERIAL NOT NULL,
    "serialnumber" INTEGER NOT NULL,
    "datacategory" VARCHAR(50) NOT NULL,
    "datadesc" VARCHAR(255) NOT NULL,
    "datadatetime" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "instrumentdata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instrumentspecific" (
    "serialnumber" SERIAL NOT NULL,
    "instrumenttypeid" INTEGER NOT NULL,
    "labid" INTEGER NOT NULL,
    "instrumentstatus" "instrument_status",

    CONSTRAINT "instrumentspecific_pkey" PRIMARY KEY ("serialnumber")
);

-- CreateTable
CREATE TABLE "instrumenttype" (
    "id" SERIAL NOT NULL,
    "instrumentname" VARCHAR(100) NOT NULL,
    "instrumentcategory" VARCHAR(50) NOT NULL,
    "instrumentamount" INTEGER NOT NULL,

    CONSTRAINT "instrumenttype_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "labs" (
    "id" SERIAL NOT NULL,
    "lablocation" VARCHAR(100) NOT NULL,
    "managerid" INTEGER NOT NULL,

    CONSTRAINT "labs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "landingpagecontent" (
    "id" SERIAL NOT NULL,
    "contenttype" VARCHAR(50) NOT NULL,
    "contentname" VARCHAR(100) NOT NULL,
    "contentdescription" TEXT,

    CONSTRAINT "landingpagecontent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" INTEGER NOT NULL,
    "labid" INTEGER NOT NULL,
    "projectname" VARCHAR NOT NULL,
    "projectdescription" VARCHAR,
    "projectstatus" "project_status",
    "creatorid" INTEGER NOT NULL,
    "projectstartdate" TIMESTAMP(6) NOT NULL,
    "projectenddate" TIMESTAMP(6),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projectusers" (
    "userid" INTEGER NOT NULL,
    "projectid" INTEGER NOT NULL,
    "projectrole" VARCHAR(50) NOT NULL,
    "projectjoindate" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "projectusers_pkey" PRIMARY KEY ("userid","projectid")
);

-- CreateTable
CREATE TABLE "systemsettings" (
    "id" SERIAL NOT NULL,
    "settingname" VARCHAR(100) NOT NULL,
    "settingvalue" VARCHAR(255) NOT NULL,
    "apikey" VARCHAR(255),

    CONSTRAINT "systemsettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "useraccess" (
    "userid" INTEGER NOT NULL,
    "serialnumber" INTEGER NOT NULL,
    "accesslevel" "access_level" NOT NULL,
    "accessstatus" "access_status" NOT NULL,
    "accessstartdate" TIMESTAMP(6) NOT NULL,
    "accessexpirydate" TIMESTAMP(6),

    CONSTRAINT "useraccess_pkey" PRIMARY KEY ("userid","serialnumber")
);

-- CreateTable
CREATE TABLE "useractivity" (
    "id" SERIAL NOT NULL,
    "activitydate" TIMESTAMP(6) NOT NULL,
    "userid" INTEGER NOT NULL,
    "activitydescription" VARCHAR(255) NOT NULL,

    CONSTRAINT "useractivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "role" "user_role" NOT NULL DEFAULT 'STANDARD_USER',
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "organisation" VARCHAR(50),
    "avatar" VARCHAR(255),
    "reset_token" VARCHAR(255),
    "reset_token_expiry" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "apikey_api_key" ON "apikey"("api");

-- CreateIndex
CREATE UNIQUE INDEX "feed_entryid_key" ON "feed"("entryid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_serialnumber_fkey" FOREIGN KEY ("serialnumber") REFERENCES "instrumentspecific"("serialnumber") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "feed" ADD CONSTRAINT "feed_channelid_fkey" FOREIGN KEY ("channelid") REFERENCES "channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_contentid_fkey" FOREIGN KEY ("contentid") REFERENCES "landingpagecontent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "instrumentaccess" ADD CONSTRAINT "instrumentaccess_serialnumber_fkey" FOREIGN KEY ("serialnumber") REFERENCES "instrumentspecific"("serialnumber") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "instrumentaccess" ADD CONSTRAINT "instrumentaccess_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "instrumentdata" ADD CONSTRAINT "instrumentdata_serialnumber_fkey" FOREIGN KEY ("serialnumber") REFERENCES "instrumentspecific"("serialnumber") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "instrumentspecific" ADD CONSTRAINT "instrumentspecific_instrumenttypeid_fkey" FOREIGN KEY ("instrumenttypeid") REFERENCES "instrumenttype"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "instrumentspecific" ADD CONSTRAINT "instrumentspecific_labid_fkey" FOREIGN KEY ("labid") REFERENCES "labs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "labs" ADD CONSTRAINT "labs_managerid_fkey" FOREIGN KEY ("managerid") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_labid_fkey" FOREIGN KEY ("labid") REFERENCES "labs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_labid_fkey1" FOREIGN KEY ("labid") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projectusers" ADD CONSTRAINT "projectusers_projectid_fkey" FOREIGN KEY ("projectid") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projectusers" ADD CONSTRAINT "projectusers_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "useraccess" ADD CONSTRAINT "useraccess_serialnumber_fkey" FOREIGN KEY ("serialnumber") REFERENCES "instrumentspecific"("serialnumber") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "useraccess" ADD CONSTRAINT "useraccess_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "useractivity" ADD CONSTRAINT "useractivity_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

