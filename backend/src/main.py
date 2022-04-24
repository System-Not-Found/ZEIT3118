from helpers.models import *
from helpers.database import Database
from fastapi import FastAPI, status, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from helpers.utils import arrays_as_dict, arrays_as_dict_array, generate_salt, combine_hash
import secrets

db = Database()
app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
# team_id and Cookie header should match in the cookie table
# cookie1Name=cookie1Value; cookie2Name=cookie2Value

@app.get("/teams/{tournament_id}")
#returns a list of Teams
async def handle_scoreboard(tournament_id: str):
    result = db.select(f"SELECT Teams.id, Teams.teamName, Teams.points FROM Teams,TournamentTeams WHERE TournamentTeams.tournamentID = %s AND TournamentTeams.teamID = Teams.id", tournament_id)
    return arrays_as_dict(["id", "teamName", "points"], result)

@app.get("/tasks/{tournament_id}/{team_id}")
async def handle_tasks(tournament_id: str, team_id: str):
    result = db.select(f"SELECT Tasks.id, Tasks.taskName, Tasks.points FROM Tasks,TournamentTeams,TasksCompleted WHERE TournamentTeams.tournamentID = %s AND TournamentTeams.teamID = %s AND TournamentTeams.id = TasksCompleted.tournamentTeamID AND TasksCompleted.taskID = Tasks.id", tournament_id, team_id)
    return arrays_as_dict(["id", "taskName", "points"], result)


@app.post("/tasks/{tournament_id}/{team_id}")
async def handle_post_task(tournament_id: str, team_id: str, request: PostTasksRequest, response: Response):
    # return 200
    # return 403 (task key doesn't match)
    result = db.select(f"SELECT Tasks.key FROM Tasks WHERE id = {request.task_id};")
    if result[0] == request.key:
        result = db.select(f"SELECT tournamentTeamID FROM TournamentTeams WHERE teamID = '{team_id}' AND tournamentID = '{tournament_id}';")
        tournamentTeam = result[0]
        if tournamentTeam != None:
            id = db.insert(f"INSERT INTO TasksCompleted (taskID,tournamentTeamID) Values ('{request.task_id}','{request.tournamentTeam}';")
            return { "id": id }
        else:
            response.status_code = status.HTTP_404_NOT_FOUND
            return { "msg": "Could not find team in tournament" }
    else:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return { "msg": "Incorrect task key provided" }
    

@app.get("/hints/{task_id}")
async def handle_hint(task_id: str, request: GetHintRequest, response: Response):
    result = db.select(f"SELECT points FROM Teams WHERE Teams.id = %s", request.team_id)
    teamPoints=result[0]
    if teamPoints>=200:
        teamPoints = teamPoints - 200
        db.update(f"UPDATE Teams SET points = %s WHERE Teams.id = %s", teamPoints, request.team_id)
        result = db.select(f"SELECT hint FROM Tasks WHERE Tasks.id = '{task_id}';")
        return { "hint": result }
    else:
        response.status_code=status.HTTP_401_UNAUTHORIZED
        return { "msg": "This team does not have enough points to get this hint." }


@app.get("/tournaments")
async def handle_tournaments():
    results = db.selectall("SELECT * FROM Tournaments;")
    return arrays_as_dict_array(["id", "name", "endTime"], results)
    

#return end time and team scores for tournament
@app.get("/tournament/{tournament_id}")
async def handle_tournament(tournament_id: str):
    result = db.select(f"SELECT * FROM Tournaments WHERE id = %s", tournament_id)
    return arrays_as_dict(["id", "name", "endTime"], result)
    

@app.post("/tournament")
async def handle_post_tournament(request: PostTournamentRequest):
    id = db.insert(f"INSERT INTO Tournaments (name, endTime) VALUES (%s, %s)", request.name, request.endTime)
    return { "id": id }


@app.patch("/tournament/{tournament_id}")
async def handle_patch_tournament(tournament_id: str, request: PatchTournamentRequest):
    result = db.select("SELECT id FROM Teams WHERE teamName = %s", request.teamName)
    team_id = arrays_as_dict(["id"], result)["id"]
    id = db.insert(f"INSERT INTO TournamentTeams (teamID, tournamentID) VALUES (%s, %s)", team_id, tournament_id)
    return { "id": id }


@app.delete("/tournament/{tournament_id}")
async def handle_delete_tournament(tournament_id: str):
    db.delete(f"DELETE from Tournaments WHERE id = %s", tournament_id)
    return f"Successfully deleted tournament"

@app.get("/names")
async def handle_get_team_names():
    results = db.selectall("SELECT Teams.Name FROM Teams")
    return arrays_as_dict_array(["id", "name", "endTime"], results)

@app.post("/register")
async def handle_register(request: RegisterRequest, response: Response):
    result = db.select(f"SELECT * FROM Teams WHERE Teams.teamName = %s", request.teamName)
    if result is not None:
        response.status_code = status.HTTP_409_CONFLICT
        return { "msg": f"Team name {request.teamName} has already been taken." }
    # Insert the team
    id = db.insert(f"INSERT INTO Teams (teamName, avatar, points, wins) VALUES (%s, %s, %s, %s)", request.teamName, request.avatar, 0, 0)

    # Insert the auth information
    salt = generate_salt()
    password = combine_hash(salt, request.password)
    db.insert(f"INSERT INTO Auth (teamID, password, salt, admin) VALUES (%s, %s, %s, %s)", id, password, salt, False)

    # Return the team id
    return { "id": id }


@app.post("/login")
async def handle_login(request: LoginRequest, response: Response):
    password_check = db.select(f"SELECT Auth.salt, Auth.password, Auth.admin FROM Auth, Teams WHERE Teams.teamName = %s AND Auth.id = Teams.id", request.teamName)
    if password_check is None:
        response.status_code=status.HTTP_404_NOT_FOUND
        return { "msg": f"Team '{request.teamName}' does not exist." }
    password_check = arrays_as_dict(["salt", "password", "admin"], password_check)

    if secrets.compare_digest(password_check["password"], combine_hash(password_check["salt"], request.password)):
        result = db.select(f"SELECT * FROM Teams WHERE Teams.teamName = %s", request.teamName)
        result = list(result)
        result.append(password_check["admin"])
        return arrays_as_dict(["id","teamName","avatar","points","wins","admin"], result)
    else:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return { "msg": "Invalid Team name and password combination" }

@app.get("/teams")
async def handle_all_teams():
    results = db.selectall("SELECT Teams.teamName FROM Teams")
    if len(results) == 0:
        return []
    return [teamName[0] for teamName in results]