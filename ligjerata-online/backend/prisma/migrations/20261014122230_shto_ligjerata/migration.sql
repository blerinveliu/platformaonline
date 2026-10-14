-- CreateTable
CREATE TABLE "ligjeratat" (
    "id" SERIAL NOT NULL,
    "titull" TEXT NOT NULL,
    "pershkrim" TEXT,
    "videoUrl" TEXT NOT NULL,
    "profesorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ligjeratat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ligjeratat" ADD CONSTRAINT "ligjeratat_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
