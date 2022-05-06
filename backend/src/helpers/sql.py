init_commands = [
    """CREATE TABLE IF NOT EXISTS `Teams` (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `teamName` VARCHAR(20) UNIQUE,
        `avatar` INT,
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
        `taskName` VARCHAR(20) UNIQUE,
        `points` INT,
        `password` VARCHAR(64),
        `hint` VARCHAR(300)
    );""",

    """
    CREATE TABLE IF NOT EXISTS `TasksCompleted` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `taskID` INT,
        `tournamentTeamID` INT
    );""",
    
    """
    CREATE TABLE IF NOT EXISTS `HintsCompleted` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `taskID` INT,
        `tournamentTeamID` INT
    );
    """,

    """CREATE TABLE IF NOT EXISTS `TournamentTeams` (
        `id` INT AUTO_INCREMENT,
        `teamID` INT,
        `tournamentID` INT,
        `points` INT,
        PRIMARY KEY (`id`, `teamID`)
    );""",

    """CREATE TABLE IF NOT EXISTS `Tournaments` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(20),
    `endTime` VARCHAR(20)
    );""",

    """CREATE TABLE IF NOT EXISTS `Cookies` (
    `cookie` VARCHAR(16) PRIMARY KEY,
    `teamID` INT
    );""",

    "ALTER TABLE `TasksCompleted` ADD FOREIGN KEY (`taskID`) REFERENCES `Tasks` (`id`) ON DELETE CASCADE;",

    "ALTER TABLE `TasksCompleted` ADD FOREIGN KEY (`tournamentTeamID`) REFERENCES `TournamentTeams` (`id`) ON DELETE CASCADE;",

    "ALTER TABLE `HintsCompleted` ADD FOREIGN KEY (`taskID`) REFERENCES `Tasks` (`id`) ON DELETE CASCADE;",

    "ALTER TABLE `HintsCompleted` ADD FOREIGN KEY (`tournamentTeamID`) REFERENCES `TournamentTeams` (`id`) ON DELETE CASCADE;",

    "ALTER TABLE `TournamentTeams` ADD FOREIGN KEY (`teamID`) REFERENCES `Teams` (`id`) ON DELETE CASCADE;",

    "ALTER TABLE `TournamentTeams` ADD FOREIGN KEY (`tournamentID`) REFERENCES `Tournaments` (`id`) ON DELETE CASCADE;",

    "ALTER TABLE `Cookies` ADD FOREIGN KEY (`teamID`) REFERENCES `Teams` (`id`) ON DELETE CASCADE;",

    "ALTER TABLE `Auth` ADD FOREIGN KEY (`teamID`) REFERENCES `Teams` (`id`) ON DELETE CASCADE;"
]