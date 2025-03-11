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
CREATE TYPE "user_role" AS ENUM ('admin', 'user', 'guest');

-- CreateTable
CREATE TABLE "alerts" (
    "alertid" SERIAL NOT NULL,
    "serialnumber" INTEGER NOT NULL,
    "priority" "priority_type",
    "alertdescription" VARCHAR(255) NOT NULL,
    "alertstatus" "alert_status" NOT NULL,
    "alertdate" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("alertid")
);

-- CreateTable
CREATE TABLE "images" (
    "imageid" SERIAL NOT NULL,
    "contentid" INTEGER NOT NULL,
    "imageurl" VARCHAR(255) NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("imageid")
);

-- CreateTable
CREATE TABLE "instrumentaccess" (
    "userid" INTEGER NOT NULL,
    "serialnumber" INTEGER NOT NULL,

    CONSTRAINT "instrumentaccess_pkey" PRIMARY KEY ("userid","serialnumber")
);

-- CreateTable
CREATE TABLE "instrumentdata" (
    "dataid" SERIAL NOT NULL,
    "serialnumber" INTEGER NOT NULL,
    "datacategory" VARCHAR(50) NOT NULL,
    "datadesc" VARCHAR(255) NOT NULL,
    "datadatetime" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "instrumentdata_pkey" PRIMARY KEY ("dataid")
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
    "instrumenttypeid" SERIAL NOT NULL,
    "instrumentname" VARCHAR(100) NOT NULL,
    "instrumentcategory" VARCHAR(50) NOT NULL,
    "instrumentamount" INTEGER NOT NULL,

    CONSTRAINT "instrumenttype_pkey" PRIMARY KEY ("instrumenttypeid")
);

-- CreateTable
CREATE TABLE "labs" (
    "labid" SERIAL NOT NULL,
    "lablocation" VARCHAR(100) NOT NULL,
    "managerid" INTEGER NOT NULL,

    CONSTRAINT "labs_pkey" PRIMARY KEY ("labid")
);

-- CreateTable
CREATE TABLE "landingpagecontent" (
    "contentid" SERIAL NOT NULL,
    "contenttype" VARCHAR(50) NOT NULL,
    "contentname" VARCHAR(100) NOT NULL,
    "contentdescription" TEXT,

    CONSTRAINT "landingpagecontent_pkey" PRIMARY KEY ("contentid")
);

-- CreateTable
CREATE TABLE "projects" (
    "projectid" INTEGER NOT NULL,
    "labid" INTEGER NOT NULL,
    "projectname" VARCHAR NOT NULL,
    "projectdescription" VARCHAR,
    "projectstatus" "project_status",
    "creatorid" INTEGER NOT NULL,
    "projectstartdate" TIMESTAMP(6) NOT NULL,
    "projectenddate" TIMESTAMP(6),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("projectid")
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
    "settingid" SERIAL NOT NULL,
    "settingname" VARCHAR(100) NOT NULL,
    "settingvalue" VARCHAR(255) NOT NULL,
    "apikey" VARCHAR(255),

    CONSTRAINT "systemsettings_pkey" PRIMARY KEY ("settingid")
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
    "activityid" SERIAL NOT NULL,
    "activitydate" TIMESTAMP(6) NOT NULL,
    "userid" INTEGER NOT NULL,
    "activitydescription" VARCHAR(255) NOT NULL,

    CONSTRAINT "useractivity_pkey" PRIMARY KEY ("activityid")
);

-- CreateTable
CREATE TABLE "users" (
    "userid" SERIAL NOT NULL,
    "userrole" "user_role" NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "userpassword" VARCHAR(50) NOT NULL,
    "firstname" VARCHAR(50) NOT NULL,
    "lastname" VARCHAR(50) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userid")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_serialnumber_fkey" FOREIGN KEY ("serialnumber") REFERENCES "instrumentspecific"("serialnumber") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_contentid_fkey" FOREIGN KEY ("contentid") REFERENCES "landingpagecontent"("contentid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "instrumentaccess" ADD CONSTRAINT "instrumentaccess_serialnumber_fkey" FOREIGN KEY ("serialnumber") REFERENCES "instrumentspecific"("serialnumber") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "instrumentaccess" ADD CONSTRAINT "instrumentaccess_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "instrumentdata" ADD CONSTRAINT "instrumentdata_serialnumber_fkey" FOREIGN KEY ("serialnumber") REFERENCES "instrumentspecific"("serialnumber") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "instrumentspecific" ADD CONSTRAINT "instrumentspecific_instrumenttypeid_fkey" FOREIGN KEY ("instrumenttypeid") REFERENCES "instrumenttype"("instrumenttypeid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "instrumentspecific" ADD CONSTRAINT "instrumentspecific_labid_fkey" FOREIGN KEY ("labid") REFERENCES "labs"("labid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "labs" ADD CONSTRAINT "labs_managerid_fkey" FOREIGN KEY ("managerid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_labid_fkey" FOREIGN KEY ("labid") REFERENCES "labs"("labid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_labid_fkey1" FOREIGN KEY ("labid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projectusers" ADD CONSTRAINT "projectusers_projectid_fkey" FOREIGN KEY ("projectid") REFERENCES "projects"("projectid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projectusers" ADD CONSTRAINT "projectusers_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "useraccess" ADD CONSTRAINT "useraccess_serialnumber_fkey" FOREIGN KEY ("serialnumber") REFERENCES "instrumentspecific"("serialnumber") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "useraccess" ADD CONSTRAINT "useraccess_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "useractivity" ADD CONSTRAINT "useractivity_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

