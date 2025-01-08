-- AlterTable
ALTER TABLE "User" ADD COLUMN     "presetProfilePictureId" TEXT;

-- CreateTable
CREATE TABLE "PresetProfilePicture" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PresetProfilePicture_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_presetProfilePictureId_fkey" FOREIGN KEY ("presetProfilePictureId") REFERENCES "PresetProfilePicture"("id") ON DELETE SET NULL ON UPDATE CASCADE;
