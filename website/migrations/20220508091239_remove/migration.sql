/*
  Warnings:

  - A unique constraint covering the columns `[hintId]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_hintId_fkey`;

-- CreateIndex
CREATE UNIQUE INDEX `Task_hintId_key` ON `Task`(`hintId`);

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_hintId_fkey` FOREIGN KEY (`hintId`) REFERENCES `Hint`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
