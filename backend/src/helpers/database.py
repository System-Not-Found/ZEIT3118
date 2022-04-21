import mysql.connector

class Database():
    def __init__(self):
        try:
            self.database = mysql.connector.connect(
                host="db",
                user="root",
                password="admin",
                port="3306",
                database="scoreboard"
            )
        except Exception as err:
            print(f"An error occured connecting to db... trying again")
            return

        database_cursor = self.database.cursor()

        init_commands = [
            """CREATE TABLE IF NOT EXISTS `Teams` (
                `id` int PRIMARY KEY AUTO_INCREMENT,
                `teamName` varchar(20),
                `password` varchar(20),
                `points` int,
                `wins` int,
                `admin` boolean
            );""",

            """
            CREATE TABLE IF NOT EXISTS `Tasks` (
                `id` int PRIMARY KEY AUTO_INCREMENT,
                `taskName` varchar(20),
                `points` int,
                `key` varchar(20),
                `hint` varchar(100)
            );""",

            """
            CREATE TABLE IF NOT EXISTS `TasksCompleted` (
                `taskID` int PRIMARY KEY,
                `tournamentTeamID` int
            );""",
            
            """CREATE TABLE IF NOT EXISTS `TournamentTeams` (
                `id` int AUTO_INCREMENT,
                `teamID` int,
                `tournamentID` int,
                PRIMARY KEY (`id`, `teamID`)
            );""",

            """CREATE TABLE IF NOT EXISTS `Tournaments` (
            `id` int PRIMARY KEY AUTO_INCREMENT,
            `name` varchar(20),
            `endTime` varchar(20)
            );""",

            """CREATE TABLE IF NOT EXISTS `Cookies` (
            `id` varchar(24),
            `teamID` int PRIMARY KEY
            );""",

            "ALTER TABLE `TasksCompleted` ADD FOREIGN KEY (`taskID`) REFERENCES `Tasks` (`id`);",

            "ALTER TABLE `TasksCompleted` ADD FOREIGN KEY (`tournamentTeamID`) REFERENCES `TournamentTeams` (`id`);",

            "ALTER TABLE `TournamentTeams` ADD FOREIGN KEY (`teamID`) REFERENCES `Teams` (`id`);",

            "ALTER TABLE `TournamentTeams` ADD FOREIGN KEY (`tournamentID`) REFERENCES `Tournaments` (`id`);",

            "ALTER TABLE `Cookies` ADD FOREIGN KEY (`teamID`) REFERENCES `Teams` (`id`);"
        ]

        for command in init_commands:
            database_cursor.execute(command)
