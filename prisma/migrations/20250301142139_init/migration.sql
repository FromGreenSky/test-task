-- CreateTable
CREATE TABLE "Holiday" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Holiday_pkey" PRIMARY KEY ("id")
);
