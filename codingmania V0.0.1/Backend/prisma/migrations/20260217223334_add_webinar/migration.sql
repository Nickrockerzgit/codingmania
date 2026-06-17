-- CreateTable
CREATE TABLE `webinars` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `date` DATE NOT NULL,
    `time` VARCHAR(50) NOT NULL,
    `mode` VARCHAR(50) NOT NULL,
    `host` VARCHAR(255) NOT NULL,
    `type` VARCHAR(100) NOT NULL,
    `place` VARCHAR(255) NULL,
    `link` VARCHAR(255) NULL,
    `capacity` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `webinar_attendances` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `webinarId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'registered',
    `registrationDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `webinar_attendances_webinarId_userId_key`(`webinarId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `webinar_attendances` ADD CONSTRAINT `webinar_attendances_webinarId_fkey` FOREIGN KEY (`webinarId`) REFERENCES `webinars`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `webinar_attendances` ADD CONSTRAINT `webinar_attendances_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
