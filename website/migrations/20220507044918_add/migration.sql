/*
  Warnings:

  - A unique constraint covering the columns `[salt]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tournamentTeamId]` on the table `CompletedHint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hintId]` on the table `CompletedHint` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[taskId]` on the table `CompletedTask` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cookie]` on the table `Cookie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Tournament` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hintId` to the `CompletedHint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskId` to the `CompletedTask` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CompletedHint` ADD COLUMN `hintId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `CompletedTask` ADD COLUMN `taskId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Hint` MODIFY `value` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `Task` MODIFY `points` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Team` MODIFY `avatar` INTEGER NOT NULL DEFAULT 0,
    MODIFY `wins` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX `Auth_salt_key` ON `Auth`(`salt`);

-- CreateIndex
CREATE UNIQUE INDEX `CompletedHint_tournamentTeamId_key` ON `CompletedHint`(`tournamentTeamId`);

-- CreateIndex
CREATE UNIQUE INDEX `CompletedHint_hintId_key` ON `CompletedHint`(`hintId`);

-- CreateIndex
CREATE UNIQUE INDEX `CompletedTask_taskId_key` ON `CompletedTask`(`taskId`);

-- CreateIndex
CREATE UNIQUE INDEX `Cookie_cookie_key` ON `Cookie`(`cookie`);

-- CreateIndex
CREATE UNIQUE INDEX `Team_name_key` ON `Team`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Tournament_name_key` ON `Tournament`(`name`);

-- AddForeignKey
ALTER TABLE `CompletedTask` ADD CONSTRAINT `CompletedTask_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompletedHint` ADD CONSTRAINT `CompletedHint_hintId_fkey` FOREIGN KEY (`hintId`) REFERENCES `Hint`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
