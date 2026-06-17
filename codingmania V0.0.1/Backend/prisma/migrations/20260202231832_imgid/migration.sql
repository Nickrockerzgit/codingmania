/*
  Warnings:

  - Added the required column `thumbnailFileId` to the `vlogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `vlogs` ADD COLUMN `thumbnailFileId` VARCHAR(191) NOT NULL;
