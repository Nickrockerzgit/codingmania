/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `vlogs` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `vlogs` ADD COLUMN `content` TEXT NULL,
    ADD COLUMN `excerpt` TEXT NULL,
    ADD COLUMN `published` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `slug` VARCHAR(191) NULL,
    MODIFY `thumbnailFileId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `vlogs_slug_key` ON `vlogs`(`slug`);
