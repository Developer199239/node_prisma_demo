-- CreateTable
CREATE TABLE "WebexPhoneNumber" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT,
    "extension" TEXT,
    "esn" TEXT,
    "state" TEXT,
    "phoneNumberType" TEXT,
    "mainNumber" BOOLEAN,
    "includedTelephonyTypes" TEXT,
    "tollFreeNumber" BOOLEAN,
    "locationId" TEXT,
    "locationName" TEXT,
    "ownerId" TEXT,
    "ownerType" TEXT,
    "ownerFirstName" TEXT,
    "ownerLastName" TEXT,
    "isServiceNumber" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebexPhoneNumber_pkey" PRIMARY KEY ("id")
);
