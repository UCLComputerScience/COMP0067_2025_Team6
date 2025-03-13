-- CreateTable
CREATE TABLE "APIkey" (
    "id" SERIAL NOT NULL,
    "api" TEXT NOT NULL,

    CONSTRAINT "APIkey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "APIkey_api_key" ON "APIkey"("api");
