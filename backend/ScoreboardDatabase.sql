CREATE TABLE `Teams` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `teamName` varchar(20),
  `password` varchar(20),
  `points` int,
  `wins` int,
  `admin` boolean
);

CREATE TABLE `Tasks` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `taskName` varchar(20),
  `points` int,
  `key` varchar(20),
  `hint` varchar(100)
);

CREATE TABLE `TasksCompleted` (
  `taskID` int PRIMARY KEY,
  `tournamentTeamID` int
);

CREATE TABLE `TournamentTeams` (
  `id` int AUTO_INCREMENT,
  `teamID` int,
  `tournamentID` int,
  PRIMARY KEY (`id`, `teamID`)
);

CREATE TABLE `Tournaments` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `TournamentName` varchar(20),
  `endTime` datetime
);

CREATE TABLE `Cookies` (
  `id` varchar(24),
  `teamID` int PRIMARY KEY
);

ALTER TABLE `TasksCompleted` ADD FOREIGN KEY (`taskID`) REFERENCES `Tasks` (`id`);

ALTER TABLE `TasksCompleted` ADD FOREIGN KEY (`tournamentTeamID`) REFERENCES `TournamentTeams` (`id`);

ALTER TABLE `TournamentTeams` ADD FOREIGN KEY (`teamID`) REFERENCES `Teams` (`id`);

ALTER TABLE `TournamentTeams` ADD FOREIGN KEY (`tournamentID`) REFERENCES `Tournaments` (`id`);

ALTER TABLE `Cookies` ADD FOREIGN KEY (`teamID`) REFERENCES `Teams` (`id`);

