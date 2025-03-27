/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "labs" DROP CONSTRAINT "labs_managerid_fkey";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "user_role" "role" NOT NULL DEFAULT 'STANDARD_USER',
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "organisation" VARCHAR(50),
    "avatar" VARCHAR(255),
    "resetToken" VARCHAR(255),
    "resetTokenExpiry" TIMESTAMP(6),
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
    "status" "user_status" NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "labs" ADD CONSTRAINT "labs_managerid_fkey" FOREIGN KEY ("managerid") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
