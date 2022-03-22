from fastapi import FastAPI
from typing import Optional
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
        except err:
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

db = Database()
app = FastAPI()

# team_id and Cookie header should match in the cookie table
# cookie1Name=cookie1Value; cookie2Name=cookie2Value

@app.get("/teams/{tournament_id}")
#returns a list of Teams
def handle_scoreboard():
    # returns 200: [{
    #   id: string
    #   teamName: string
    #   points: string
    # }]
    pass

@app.get("/tasks/{tournament_id}/{team_id}")
def handle_tasks():
    # returns 200: [{
    #   id: ""
    #   taskName: ""
    #   points: ""
    # }]
    pass

@app.post("/tasks/{tournament_id}/{team_id}")
def handle_post_task():
    # {
    #   id: ""
    #   key: ""
    # }
    # return 200
    # return 403 (task key doesn't match)
    pass

@app.get("/hints/{tournament_id}/{team_id}/{task_id}")
def handle_hint():
    # validate that they have points (if they dont return 403)
    # remove points
    # return 200 {hint: ""}
    pass

@app.get("/tournaments")
def handle_tournaments():
    # list all current tournaments
    # [{
    #   id: ""
    #   name: ""
    # }]
    pass

#return end time and team scores for tournament
@app.get("/tournament/{tournament_id}")
def handle_tournament():
    #returns 200 {
    # name: "",
    # endTime: "",
    #}
    cursor = db.database.cursor()
    result = cursor.execute(f"SELECT * FROM Tournaments WHERE id = {tournament_id};")
    db.database.commit()
    return result

@app.post("/tournament")
def handle_post_tournament():
    # {
    #   name: ""
    #   endTime: ""
    # }
    # return { tournament_id }
    try:
        cursor = db.database.cursor()
        result = cursor.execute("INSERT INTO Tournaments (name, endTime) VALUES ('ooga', 'boonga');")
        db.database.commit()
        return f"Successfully added tournament"
    except Exception as e:
        return f"Internal Server Error: {e}"

@app.patch("/tournament/{tournament_id}")
def handle_patch_tournament():
    # Add teams to tournament via the teamId
    # {
    #   id: ""
    # }
    pass

@app.delete("/tournament/{tournament_id}")
def handle_delete_tournament():
    # delete tournament
    pass

@app.post("/register/")
def handle_register():
    #{
    #   teamName: ""
    #   password: "" 
    #}
    # returns 200: {
    #   id: "team id"
    # }
    # returns 409 (team name has been taken)

    # Header { Set-Cookie: teamName=base64encodedcookie }
    pass

@app.post("/login/")
def handle_login():
    # Handle login, will be provided a JSON document with:
    # {
    #   teamName: "name of team"
    #   password: "SHA256 hash of password attempt"
    # }
    # returns 200: {
    #   id: "team id"
    # }

    # Header { Set-Cookie: teamName=base64encodedcookie }
    pass