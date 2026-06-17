-- CreateTable
CREATE TABLE `carouseltable` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `image` VARCHAR(500) NOT NULL,

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
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

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
    `rules_guidelines` TEXT NULL,
    `registration_start` DATETIME(0) NULL,
    `registration_end` DATETIME(0) NULL,
    `event_start` DATETIME(0) NULL,
    `event_end` DATETIME(0) NULL,

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
    `website` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL,
    `role` VARCHAR(100) NULL,
    `image` VARCHAR(255) NULL,
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
    `join_date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    UNIQUE INDEX `phone`(`phone`),
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
    `video_url` TEXT NOT NULL,
    `thumbnail_url` TEXT NOT NULL,
    `duration` TEXT NOT NULL,
    `views` INTEGER NULL DEFAULT 0,
    `likes` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `id`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
