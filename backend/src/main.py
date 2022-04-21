import json
from helpers.models import *
from helpers.database import Database
from fastapi import FastAPI, status, HTTPException


db = Database()
app = FastAPI()

# team_id and Cookie header should match in the cookie table
# cookie1Name=cookie1Value; cookie2Name=cookie2Value

@app.get("/teams/{tournament_id}")
#returns a list of Teams
async def handle_scoreboard(tournament_id: str):
    try:
        cursor = db.database.cursor()
        result = cursor.execute(f"SELECT Teams.id, Teams.teamName, Teams.points FROM Teams,TournamentTeams WHERE TournamentTeams.tournamentID = {tournament_id} AND TournamentTeams.teamID = Teams.id;")
        db.database.commit()
        return result
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=err
        )


@app.get("/tasks/{tournament_id}/{team_id}")
async def handle_tasks(tournament_id: str, team_id: str):
    try:
        cursor = db.database.cursor()
        result = cursor.execute(f"SELECT Tasks.id, Tasks.taskName, Tasks.points FROM Tasks,TournamentTeams,TasksCompleted WHERE TournamentTeams.tournamentID = {tournament_id} AND TournamentTeams.teamID = {team_id} AND TournamentTeams.id = TasksCompleted.tournamentTeamID AND TasksCompleted.taskID = Tasks.id;")
        db.database.commit()
        return result
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=err
        )


@app.post("/tasks/{tournament_id}/{team_id}")
async def handle_post_task(tournament_id: str, team_id: str, request: PostTasksRequest):
    # return 200
    # return 403 (task key doesn't match)
    cursor = db.database.cursor()
    cursor.execute(f"SELECT Tasks.key FROM Tasks WHERE id = {request.task_id};")
    row = cursor.fetchone()
    db.database.commit()
    if row[0] == key:
        cursor.execute(f"SELECT tournamentTeamID FROM TournamentTeams WHERE teamID = {team_id} AND tournamentID = {tournament_id};")
        row = cursor.fetchone()
        db.database.commit()
        tournamentTeam = row[0]
        if tournamentTeam != None:
            cursor = db.database.cursor()
            result = cursor.execute(f"INSERT INTO TasksCompleted (taskID,tournamentTeamID) Values ({request.task_id},{request.tournamentTeam};")
            db.database.commit()
            return json.dumps(result)
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Could not find team in tournament"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect task key provided"
        )
    

@app.get("/hints/{task_id}")
async def handle_hint(task_id: str, request: GetHintRequest):
    # validate that they have points (if they dont return 403)
    # remove points
    # return 200 {hint: ""}
    cursor = db.database.cursor()
    result = cursor.execute(f"SELECT points FROM Teams WHERE Teams.id = {request.team_id};")
    row = cursor.fetchone()
    db.database.commit()
    teamPoints=row[0]
    if teamPoints>=200:
        teamPoints = teamPoints - 200
        cursor1 = db.database.cursor()
        result = cursor1.execute(f"UPDATE Teams SET points = {teamPoints} WHERE Teams.id = {request.team_id};")
        row = cursor1.fetchone()
        db.database.commit()
        cursor1 = db.database.cursor()
        result = cursor1.execute(f"SELECT hint FROM Tasks WHERE Tasks.id = {task_id};")
        db.database.commit()
        return json.dumps(result)
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="This team does not have enough points to get this hint."
        )


@app.get("/tournaments")
async def handle_tournaments():
    try: 
        cursor = db.database.cursor()
        result = await cursor.execute(f"SELECT * FROM Tournaments;")
        db.database.commit()
        return json.dumps(result)
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=err
        )
    

#return end time and team scores for tournament
@app.get("/tournament/{tournament_id}")
async def handle_tournament(tournament_id: str):
    #returns 200 {
    # name: "",
    # endTime: "",
    #}
    try:
        cursor = db.database.cursor()
        result = cursor.execute(f"SELECT * FROM Tournaments WHERE id = {tournament_id};")
        db.database.commit()
        return json.dumps(result)
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=err
        )
    

@app.post("/tournament")
async def handle_post_tournament(request: PostTournamentRequest):
    # {
    #   name: ""
    #   endTime: ""
    # }
    # return { tournament_id }
    try:
        cursor = db.database.cursor()
        result = cursor.execute(f"INSERT INTO Tournaments (name, endTime) VALUES ({request.name}, {request.endTime});")
        db.database.commit()
        return json.dumps(result)
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=err
        )


@app.patch("/tournament/{tournament_id}")
async def handle_patch_tournament(tournament_id: str, request: PatchTournamentRequest):
    # Add teams to tournament via the teamId
    # {
    #   id: ""
    # }
    try:
        cursor = db.database.cursor()
        result = cursor.execute(f"INSERT INTO TournamentTeams (teamID, tournamentID) VALUES ({request.team_id}, {tournament_id});")
        db.database.commit()
        return json.dumps(result)
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=err
        )


@app.delete("/tournament/{tournament_id}")
async def handle_delete_tournament(tournament_id: str):
    # delete tournament
    try:
        cursor = db.database.cursor()
        cursor.execute(f"DELETE from Tournaments WHERE id = {tournament_id});")
        db.database.commit()
        return f"Successfully deleted tournament"
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=err
        )


@app.post("/register/")
async def handle_register():
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
async def handle_login():
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
