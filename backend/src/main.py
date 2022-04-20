import string

from fastapi import FastAPI
from typing import Optional
import mysql.connector
from pydantic import BaseModel

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

db = Database()
app = FastAPI()

# team_id and Cookie header should match in the cookie table
# cookie1Name=cookie1Value; cookie2Name=cookie2Value

@app.get("/teams/{tournament_id}")
#returns a list of Teams
def handle_scoreboard(tournament_id: string):
    # returns 200: [{
    #   id: string
    #   teamName: string
    #   points: string
    # }]
    cursor = db.database.cursor()
    result = cursor.execute(f"SELECT Teams.id, Teams.teamName, Teams.points FROM Teams,TournamentTeams WHERE TournamentTeams.tournamentID = {tournament_id} AND TournamentTeams.teamID = Teams.id;")
    db.database.commit()
    return result

@app.get("/tasks/{tournament_id}/{team_id}")
def handle_tasks(tournament_id: string, team_id: string):
    # returns 200: [{
    #   id: ""
    #   taskName: ""
    #   points: ""
    # }]
    cursor = db.database.cursor()
    result = cursor.execute(f"SELECT Tasks.id, Tasks.taskName, Tasks.points FROM Tasks,TournamentTeams,TasksCompleted WHERE TournamentTeams.tournamentID = {tournament_id} AND TournamentTeams.teamID = {team_id} AND TournamentTeams.id = TasksCompleted.tournamentTeamID AND TasksCompleted.taskID = Tasks.id;")
    db.database.commit()
    return result

@app.post("/tasks/{tournament_id}/{team_id}")
def handle_post_task(tournament_id: string, team_id: string, task_id: string, key: string):
    # {
    #   id: ""
    #   key: ""
    # }
    # return 200
    # return 403 (task key doesn't match)
    cursor1 = db.database.cursor()
    result1 = cursor1.execute(f"SELECT Tasks.key FROM Tasks WHERE id = {task_id};")
    #"SELECT Tasks.key FROM Tasks,TournamentTeams,TasksCompleted WHERE TournamentTeams.tournamentID = {tournament_id} AND TournamentTeams.teamID = {team_id} AND TournamentTeams.id = TasksCompleted.tournamentTeamID AND TasksCompleted.taskID = Tasks.id;"
    row = cursor1.fetchone()
    db.database.commit()
    if row[0] == key:
        cursor2 = db.database.cursor()
        result2 = cursor2.execute(f"SELECT tournamentTeamID FROM TournamentTeams WHERE teamID = {team_id} AND tournamentID = {tournament_id};")
        row2 = cursor2.fetchone()
        db.database.commit()
        tournamentTeam = row2[0]
        if tournamentTeam != None:
            cursor = db.database.cursor()
            result = cursor.execute(f"INSERT INTO TasksCompleted (taskID,tournamentTeamID) Values ({task_id},{tournamentTeam};")
            db.database.commit()
            return f"Successfully submitted task"
        else:
            return f"Error: Couldn't find team in tournament."
    else:
        return f"Incorrect key, try again."
    

@app.get("/hints/{tournament_id}/{team_id}/{task_id}")
def handle_hint(tournament_id: string, team_id: string, task_id: string):
    # validate that they have points (if they dont return 403)
    # remove points
    # return 200 {hint: ""}
    cursor = db.database.cursor()
    result = cursor.execute(f"SELECT points FROM Teams WHERE Teams.id = {team_id};")
    row = cursor.fetchone()
    db.database.commit()
    teamPoints=row[0]
    if teamPoints>=200:
        teamPoints = teamPoints - 200
        cursor1 = db.database.cursor()
        result = cursor1.execute(f"UPDATE Teams SET points = {teamPoints} WHERE Teams.id = {team_id};")
        row = cursor1.fetchone()
        db.database.commit()
        cursor1 = db.database.cursor()
        result = cursor1.execute(f"SELECT hint FROM Tasks WHERE Tasks.id = {task_id};")
        db.database.commit()
        return result
    else:
        return f"This team does not have enough points to get this hint."


@app.get("/tournaments")
def handle_tournaments():
    # list all current tournaments
    # [{
    #   id: ""
    #   name: ""
    # }]
    cursor = db.database.cursor()
    result = cursor.execute(f"SELECT * FROM Tournaments;")
    db.database.commit()
    return result

#return end time and team scores for tournament
@app.get("/tournament/{tournament_id}")
def handle_tournament(tournament_id: string):
    #returns 200 {
    # name: "",
    # endTime: "",
    #}
    cursor = db.database.cursor()
    result = cursor.execute(f"SELECT * FROM Tournaments WHERE id = {tournament_id};")
    db.database.commit()
    return result

@app.post("/tournament")
def handle_post_tournament(name: string, endTime: string):
    # {
    #   name: ""
    #   endTime: ""
    # }
    # return { tournament_id }
    try:
        cursor = db.database.cursor()
        result = cursor.execute(f"INSERT INTO Tournaments (name, endTime) VALUES ({name}, {endTime});")
        db.database.commit()
        return f"Successfully added tournament"
    except Exception as e:
        return f"Internal Server Error: {e}"

@app.patch("/tournament/{tournament_id}")
def handle_patch_tournament(team_id: string, tournament_id: string):
    # Add teams to tournament via the teamId
    # {
    #   id: ""
    # }
    try:
        cursor = db.database.cursor()
        result = cursor.execute(f"INSERT INTO TournamentTeams (teamID, tournamentID) VALUES ({team_id}, {tournament_id});")
        db.database.commit()
        return f"Successfully added team"
    except Exception as e:
        return f"Internal Server Error: {e}"

@app.delete("/tournament/{tournament_id}")
def handle_delete_tournament(tournament_id: string):
    # delete tournament
    try:
        cursor = db.database.cursor()
        result = cursor.execute(f"DELETE from Tournaments WHERE id = {tournament_id});")
        db.database.commit()
        return f"Successfully added team"
    except Exception as e:
        return f"Internal Server Error: {e}"

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
