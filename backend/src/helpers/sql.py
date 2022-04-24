init_commands = [
    """CREATE TABLE IF NOT EXISTS `Teams` (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `teamName` VARCHAR(20),
        `avatar` INT,
        `points` INT,
        `wins` INT
    );""",

    """CREATE TABLE IF NOT EXISTS `Auth` (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `teamID` INT,
        `password` VARCHAR(100),
        `salt` VARCHAR(16),
        `admin` BOOLEAN
    );"""

    """
    CREATE TABLE IF NOT EXISTS `Tasks` (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `taskName` VARCHAR(20),
        `points` INT,
        `key` VARCHAR(20),
        `hint` VARCHAR(100)
    );""",

    """
    CREATE TABLE IF NOT EXISTS `TasksCompleted` (
        `taskID` INT PRIMARY KEY,
        `tournamentTeamID` INT
    );""",
    
    """CREATE TABLE IF NOT EXISTS `TournamentTeams` (
        `id` INT AUTO_INCREMENT,
        `teamID` INT,
        `tournamentID` INT,
        PRIMARY KEY (`id`, `teamID`)
    );""",

    """CREATE TABLE IF NOT EXISTS `Tournaments` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(20),
    `endTime` VARCHAR(20)
    );""",

    """CREATE TABLE IF NOT EXISTS `Cookies` (
    `id` VARCHAR(24),
    `teamID` INT PRIMARY KEY
    );""",

    "ALTER TABLE `TasksCompleted` ADD FOREIGN KEY (`taskID`) REFERENCES `Tasks` (`id`);",

    "ALTER TABLE `TasksCompleted` ADD FOREIGN KEY (`tournamentTeamID`) REFERENCES `TournamentTeams` (`id`);",

    "ALTER TABLE `TournamentTeams` ADD FOREIGN KEY (`teamID`) REFERENCES `Teams` (`id`);",

    "ALTER TABLE `TournamentTeams` ADD FOREIGN KEY (`tournamentID`) REFERENCES `Tournaments` (`id`);",

    "ALTER TABLE `Cookies` ADD FOREIGN KEY (`teamID`) REFERENCES `Teams` (`id`);",

    "ALTER TABLE `Auth` ADD FOREIGN KEY (`teamID`) REFERENCES `Teams` (`id`);"
]