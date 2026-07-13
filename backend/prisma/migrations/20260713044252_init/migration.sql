/*
  Warnings:

  - The primary key for the `message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `content` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `deleted` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `receiverId` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `message` table. All the data in the column will be lost.
  - Added the required column `conversationId` to the `message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `message` DROP PRIMARY KEY,
    DROP COLUMN `content`,
    DROP COLUMN `createdBy`,
    DROP COLUMN `deleted`,
    DROP COLUMN `receiverId`,
    DROP COLUMN `updatedBy`,
    ADD COLUMN `conversationId` INTEGER NOT NULL,
    ADD COLUMN `status` ENUM('SENT', 'DELIVERED', 'READ') NOT NULL DEFAULT 'SENT',
    ADD COLUMN `text` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ALTER COLUMN `updatedAt` DROP DEFAULT,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `conversation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `isGroup` BOOLEAN NOT NULL DEFAULT false,
    `groupName` VARCHAR(191) NULL,
    `groupAvatar` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conversation_participant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `conversationId` INTEGER NOT NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isAdmin` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `conversation_participant_userId_conversationId_key`(`userId`, `conversationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `conversation_participant` ADD CONSTRAINT `conversation_participant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversation_participant` ADD CONSTRAINT `conversation_participant_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
