-- DropForeignKey
ALTER TABLE `CompletedHint` DROP FOREIGN KEY `CompletedHint_hintId_fkey`;

-- DropForeignKey
ALTER TABLE `CompletedHint` DROP FOREIGN KEY `CompletedHint_tournamentTeamId_fkey`;

-- DropForeignKey
ALTER TABLE `CompletedTask` DROP FOREIGN KEY `CompletedTask_taskId_fkey`;

-- DropForeignKey
ALTER TABLE `CompletedTask` DROP FOREIGN KEY `CompletedTask_tournamentTeamId_fkey`;

-- DropForeignKey
ALTER TABLE `Cookie` DROP FOREIGN KEY `Cookie_teamId_fkey`;

-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_hintId_fkey`;

-- DropForeignKey
ALTER TABLE `TournamentTeam` DROP FOREIGN KEY `TournamentTeam_teamId_fkey`;

-- DropForeignKey
ALTER TABLE `TournamentTeam` DROP FOREIGN KEY `TournamentTeam_tournamentId_fkey`;

-- AddForeignKey
ALTER TABLE `TournamentTeam` ADD CONSTRAINT `TournamentTeam_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TournamentTeam` ADD CONSTRAINT `TournamentTeam_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `Tournament`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompletedTask` ADD CONSTRAINT `CompletedTask_tournamentTeamId_fkey` FOREIGN KEY (`tournamentTeamId`) REFERENCES `TournamentTeam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompletedTask` ADD CONSTRAINT `CompletedTask_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompletedHint` ADD CONSTRAINT `CompletedHint_tournamentTeamId_fkey` FOREIGN KEY (`tournamentTeamId`) REFERENCES `TournamentTeam`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompletedHint` ADD CONSTRAINT `CompletedHint_hintId_fkey` FOREIGN KEY (`hintId`) REFERENCES `Hint`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_hintId_fkey` FOREIGN KEY (`hintId`) REFERENCES `Hint`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cookie` ADD CONSTRAINT `Cookie_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
