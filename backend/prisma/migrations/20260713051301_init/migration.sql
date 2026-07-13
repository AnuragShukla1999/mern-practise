/*
  Warnings:

  - A unique constraint covering the columns `[mobile]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `message` ALTER COLUMN `updatedAt` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `users_mobile_key` ON `users`(`mobile`);
