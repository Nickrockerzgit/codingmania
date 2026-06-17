-- CreateTable
CREATE TABLE `carouseltable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `image` VARCHAR(500) NOT NULL,
    `fileId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eventdata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `team_name` VARCHAR(255) NOT NULL,
    `team_leader_name` VARCHAR(255) NOT NULL,
    `team_leader_email` VARCHAR(255) NOT NULL,
    `team_leader_phone` VARCHAR(20) NULL,
    `members` JSON NOT NULL,
    `category` VARCHAR(255) NOT NULL,
    `project_name` VARCHAR(255) NOT NULL,
    `project_description` TEXT NOT NULL,
    `github` VARCHAR(255) NOT NULL,
    `linkedin` VARCHAR(255) NOT NULL,
    `project_proposal` VARCHAR(255) NULL,
    `proposalFileId` VARCHAR(191) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `date` DATETIME(0) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `participants` VARCHAR(100) NOT NULL,
    `prize_pool` VARCHAR(100) NOT NULL,
    `entry_fee` VARCHAR(100) NOT NULL,
    `categories` VARCHAR(255) NOT NULL,
    `about` TEXT NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `fileId` VARCHAR(191) NULL,
    `rules_guidelines` TEXT NULL,
    `registration_start` DATETIME(0) NULL,
    `registration_end` DATETIME(0) NULL,
    `event_start` DATETIME(0) NULL,
    `event_end` DATETIME(0) NULL,
    `registration_open` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `join_us` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `college_name` VARCHAR(255) NULL,
    `course_stream` VARCHAR(255) NULL,
    `year_of_study` VARCHAR(20) NULL,
    `skills` TEXT NULL,
    `interests` TEXT NULL,
    `motivation` TEXT NULL,
    `github_url` VARCHAR(255) NULL,
    `linkedin_url` VARCHAR(255) NULL,
    `website_url` VARCHAR(255) NULL,
    `team_preferences` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `status` VARCHAR(20) NULL DEFAULT 'pending',
    `role_applied` VARCHAR(20) NOT NULL DEFAULT 'admin',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `otp` VARCHAR(10) NOT NULL,
    `expires_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sponsors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `logo` VARCHAR(255) NOT NULL,
    `fileId` VARCHAR(191) NULL,
    `website` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL,
    `role` VARCHAR(100) NULL,
    `image` VARCHAR(255) NULL,
    `fileId` VARCHAR(191) NULL,
    `github` VARCHAR(255) NULL,
    `linkedin` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(15) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `bio` TEXT NULL,
    `location` VARCHAR(255) NULL DEFAULT '',
    `avatar` VARCHAR(500) NULL DEFAULT '',
    `avatarFileId` VARCHAR(191) NULL,
    `join_date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `role` VARCHAR(20) NOT NULL DEFAULT 'student',
    `adminAccess` BOOLEAN NOT NULL DEFAULT false,
    `superAdminAccess` BOOLEAN NOT NULL DEFAULT false,
    `applicationStatus` VARCHAR(20) NULL DEFAULT 'pending',
    `appliedRole` VARCHAR(20) NULL,
    `yearOfStudy` VARCHAR(20) NULL,
    `collegeName` VARCHAR(255) NULL,
    `githubUrl` VARCHAR(255) NULL,
    `websiteUrl` VARCHAR(255) NULL,
    `company` VARCHAR(255) NULL,
    `position` VARCHAR(255) NULL,
    `batch` VARCHAR(20) NULL,
    `branch` VARCHAR(100) NULL,

    UNIQUE INDEX `email`(`email`),
    UNIQUE INDEX `phone`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tasks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `deadline` DATE NOT NULL,
    `priority` VARCHAR(20) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `progress` INTEGER NOT NULL DEFAULT 0,
    `userId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users1` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(15) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `bio` TEXT NULL,
    `location` VARCHAR(255) NULL,
    `avatar` VARCHAR(255) NULL,

    UNIQUE INDEX `email`(`email`),
    UNIQUE INDEX `phone`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vlogs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` TEXT NOT NULL,
    `content` TEXT NULL,
    `excerpt` TEXT NULL,
    `slug` VARCHAR(191) NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `video_url` TEXT NOT NULL,
    `thumbnail_url` TEXT NOT NULL,
    `videoFileId` VARCHAR(191) NULL,
    `thumbnailFileId` VARCHAR(191) NULL,
    `duration` TEXT NOT NULL,
    `views` INTEGER NULL DEFAULT 0,
    `likes` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `id`(`id`),
    UNIQUE INDEX `vlogs_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `roadmap` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `category` VARCHAR(255) NULL,
    `difficulty` VARCHAR(50) NOT NULL DEFAULT 'beginner',
    `duration` VARCHAR(100) NULL,
    `authorId` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `roadmap_authorId_idx`(`authorId`),
    INDEX `roadmap_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roadmap_step` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roadmapId` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `link` VARCHAR(500) NULL,
    `step_order` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `roadmap_step_roadmapId_idx`(`roadmapId`),
    UNIQUE INDEX `roadmap_step_roadmapId_step_order_key`(`roadmapId`, `step_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roadmap_progress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `roadmapId` INTEGER NOT NULL,
    `stepId` INTEGER NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `roadmap_progress_studentId_roadmapId_idx`(`studentId`, `roadmapId`),
    INDEX `roadmap_progress_roadmapId_idx`(`roadmapId`),
    UNIQUE INDEX `roadmap_progress_studentId_stepId_key`(`studentId`, `stepId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_tasks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `deadline` DATE NOT NULL,
    `priority` VARCHAR(20) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
    `progress` INTEGER NOT NULL DEFAULT 0,
    `userId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `student_tasks_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_roadmaps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `category` VARCHAR(255) NULL,
    `difficulty` VARCHAR(50) NOT NULL DEFAULT 'beginner',
    `duration` VARCHAR(100) NULL,
    `authorId` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `student_roadmaps_authorId_idx`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_roadmap_step` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roadmapId` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `link` VARCHAR(500) NULL,
    `step_order` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `student_roadmap_step_roadmapId_idx`(`roadmapId`),
    UNIQUE INDEX `student_roadmap_step_roadmapId_step_order_key`(`roadmapId`, `step_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_roadmap_progress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `roadmapId` INTEGER NOT NULL,
    `stepId` INTEGER NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `student_roadmap_progress_studentId_roadmapId_idx`(`studentId`, `roadmapId`),
    UNIQUE INDEX `student_roadmap_progress_studentId_stepId_key`(`studentId`, `stepId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alumni_tasks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `deadline` DATE NOT NULL,
    `priority` VARCHAR(20) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
    `progress` INTEGER NOT NULL DEFAULT 0,
    `userId` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `alumni_tasks_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alumni_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `bio` TEXT NULL,
    `location` VARCHAR(255) NULL,
    `company` VARCHAR(255) NULL,
    `position` VARCHAR(255) NULL,
    `batch` VARCHAR(20) NULL,
    `branch` VARCHAR(100) NULL,
    `githubUrl` VARCHAR(255) NULL,
    `linkedinUrl` VARCHAR(255) NULL,
    `websiteUrl` VARCHAR(255) NULL,
    `skills` TEXT NULL,
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `alumni_profiles_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `events_new` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `date` DATETIME(0) NOT NULL,
    `endDate` DATETIME(0) NOT NULL,
    `organizer` VARCHAR(255) NOT NULL,
    `tags` TEXT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'upcoming',
    `description` TEXT NULL,
    `link` TEXT NULL,
    `creatorId` INTEGER NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `events_new_creatorId_idx`(`creatorId`),
    INDEX `events_new_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jobs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `company` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `type` VARCHAR(50) NOT NULL DEFAULT 'FULL_TIME',
    `deadline` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,
    `applicationLink` TEXT NULL,
    `tags` TEXT NULL,
    `posterId` INTEGER NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `jobs_posterId_idx`(`posterId`),
    INDEX `jobs_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `bio` TEXT NULL,
    `location` VARCHAR(255) NULL,
    `yearOfStudy` VARCHAR(20) NULL,
    `collegeName` VARCHAR(255) NULL,
    `branch` VARCHAR(100) NULL,
    `githubUrl` VARCHAR(255) NULL,
    `websiteUrl` VARCHAR(255) NULL,
    `skills` TEXT NULL,
    `interests` TEXT NULL,
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `student_profiles_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conversation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userPairKey` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastMessageAt` DATETIME(3) NULL,

    UNIQUE INDEX `conversation_userPairKey_key`(`userPairKey`),
    INDEX `conversation_lastMessageAt_idx`(`lastMessageAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conversation_participant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `conversationId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    INDEX `conversation_participant_userId_idx`(`userId`),
    INDEX `conversation_participant_conversationId_idx`(`conversationId`),
    UNIQUE INDEX `conversation_participant_conversationId_userId_key`(`conversationId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `conversationId` INTEGER NOT NULL,
    `senderId` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `message_conversationId_idx`(`conversationId`),
    INDEX `message_senderId_idx`(`senderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `certificates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `issuer` VARCHAR(255) NOT NULL,
    `date` DATE NOT NULL,
    `description` TEXT NULL,
    `credentialId` VARCHAR(100) NULL,
    `skills` TEXT NULL,
    `downloadUrl` VARCHAR(255) NULL,
    `verificationUrl` VARCHAR(255) NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'completed',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `certificates_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `webinar_attendances` ADD CONSTRAINT `webinar_attendances_webinarId_fkey` FOREIGN KEY (`webinarId`) REFERENCES `webinars`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `webinar_attendances` ADD CONSTRAINT `webinar_attendances_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roadmap` ADD CONSTRAINT `roadmap_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roadmap_step` ADD CONSTRAINT `roadmap_step_roadmapId_fkey` FOREIGN KEY (`roadmapId`) REFERENCES `roadmap`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roadmap_progress` ADD CONSTRAINT `roadmap_progress_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roadmap_progress` ADD CONSTRAINT `roadmap_progress_roadmapId_fkey` FOREIGN KEY (`roadmapId`) REFERENCES `roadmap`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roadmap_progress` ADD CONSTRAINT `roadmap_progress_stepId_fkey` FOREIGN KEY (`stepId`) REFERENCES `roadmap_step`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_tasks` ADD CONSTRAINT `student_tasks_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_roadmaps` ADD CONSTRAINT `student_roadmaps_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_roadmap_step` ADD CONSTRAINT `student_roadmap_step_roadmapId_fkey` FOREIGN KEY (`roadmapId`) REFERENCES `student_roadmaps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_roadmap_progress` ADD CONSTRAINT `student_roadmap_progress_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_roadmap_progress` ADD CONSTRAINT `student_roadmap_progress_roadmapId_fkey` FOREIGN KEY (`roadmapId`) REFERENCES `student_roadmaps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_roadmap_progress` ADD CONSTRAINT `student_roadmap_progress_stepId_fkey` FOREIGN KEY (`stepId`) REFERENCES `student_roadmap_step`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alumni_tasks` ADD CONSTRAINT `alumni_tasks_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alumni_profiles` ADD CONSTRAINT `alumni_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `events_new` ADD CONSTRAINT `events_new_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jobs` ADD CONSTRAINT `jobs_posterId_fkey` FOREIGN KEY (`posterId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_profiles` ADD CONSTRAINT `student_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversation_participant` ADD CONSTRAINT `conversation_participant_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversation_participant` ADD CONSTRAINT `conversation_participant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `certificates` ADD CONSTRAINT `certificates_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
