from typing import Optional
from helpers.models import *
from helpers.database import Database
from fastapi import FastAPI, status, Cookie, Response
from fastapi.middleware.cors import CORSMiddleware
from helpers.utils import arrays_as_dict, arrays_as_dict_array, generate_random_string, combine_hash
import secrets

db = Database()
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET","POST","PATCH","DELETE","OPTIONS"],
    allow_headers=["Content-Type", "Set-Cookie", "Cookie"]
)

def get_team_id_from_cookie(team_login: str):
    team_id = db.selectval("SELECT teamID FROM Cookies WHERE cookie = %s", team_login)
    if team_id == None:
        return None
    return team_id


def check_admin_privileges_from_cookie(cookie: str) -> bool:
    team_id = get_team_id_from_cookie(cookie)
    if team_id == None:
        return False
    admin = db.selectval("SELECT admin FROM Auth WHERE teamID = %s", team_id)
    print(admin)
    return admin


@app.get("/teams/{tournament_id}")
#returns a list of Teams
async def handle_scoreboard(tournament_id: str):
    result = db.selectall(f"SELECT Teams.id, Teams.teamName, TournamentTeams.points, Teams.avatar FROM Teams,TournamentTeams WHERE TournamentTeams.tournamentID = %s AND TournamentTeams.teamID = Teams.id", tournament_id)
    return arrays_as_dict_array(["id", "teamName", "points", "avatar"], result)

@app.get("/tasks/{tournament_id}")
async def handle_tasks(tournament_id: str, response: Response, team_login: Optional[str] = Cookie(None)):
    team_id = get_team_id_from_cookie(team_login)
    print("LOGIN: ", team_login, " ID: ", team_id)
    if team_id == None:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return { "msg": "Cannot get unauthorized information about team"}
    result = db.selectall(f"SELECT Tasks.id FROM Tasks,TournamentTeams,TasksCompleted WHERE TournamentTeams.tournamentID = %s AND TournamentTeams.teamID = %s AND TournamentTeams.id = TasksCompleted.tournamentTeamID AND TasksCompleted.taskID = Tasks.id", tournament_id, team_id)
    return arrays_as_dict_array(["id"], result)


@app.post("/tasks")
async def handle_post_tasks(request: PostTasksRequest, response: Response, team_login: Optional[str] = Cookie(None)):
    if not check_admin_privileges_from_cookie(team_login):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return { "msg": "Require admin privileges to create tasks" }
    if len(request.taskName) > 20:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return { "msg": "Task name cannot be longer than 20 characters" }
    if len(request.password) > 64:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return { "msg": "Task password cannot be longer than 64 characters" }
    if len(request.hint) > 300:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return { "msg": "Task hint cannot be longer than 300 characters" }
    id = db.insert(f"INSERT INTO Tasks (taskName, points, password, hint) VALUES (%s, %s, %s, %s)", request.taskName, request.points, request.password, request.hint)
    return { "id": id }


@app.get("/tasks")
async def handle_get_tasks():
    result = db.selectall("SELECT id, taskName, points FROM Tasks")
    if result == None:
        return []
    return arrays_as_dict_array(["id", "taskName", "points"], result)

@app.post("/tasks/{tournament_id}")
async def handle_post_task(tournament_id: int, request: PostTaskRequest, response: Response, team_login: Optional[str] = Cookie(None)):
    team_id = get_team_id_from_cookie(team_login)
    if team_id == None:
        response.status_code = status.HTTP_204_NO_CONTENT
        return { "msg": "Cookie provided is invalid" }

    password = db.selectval(f"SELECT password FROM Tasks WHERE id = %s", request.task_id)
    if password == request.password:
        tournament_team_id = db.selectval(f"SELECT id FROM TournamentTeams WHERE teamID = %s AND tournamentID = %s", team_id, tournament_id)
        if tournament_id != None:
            try:
                id = db.insert(f"INSERT INTO TasksCompleted (taskID,tournamentTeamID) VALUES (%s,%s)", request.task_id, tournament_team_id)
            except:
                response.status_code = status.HTTP_409_CONFLICT
                return { "msg": "Task already submitted" }
            team_points = db.selectval("SELECT points FROM TournamentTeams WHERE id = %s", tournament_team_id)
            task_points = db.selectval("SELECT points FROM Tasks WHERE id = %s", request.task_id)
            team_points = team_points + task_points
            db.update(f"UPDATE TournamentTeams SET points = %s WHERE id = %s", team_points, tournament_team_id)
            return { "id": id }
        else:
            response.status_code = status.HTTP_404_NOT_FOUND
            return { "msg": "Could not find team in tournament" }
    else:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return { "msg": "Incorrect task password provided" }
    

@app.post("/hints/{tournament_id}")
async def handle_hint(tournament_id: int, response: Response, request: GetHintRequest, team_login: Optional[str] = Cookie(None)):
    team_id = get_team_id_from_cookie(team_login)
    if team_id == None:
        response.status_code = status.HTTP_204_NO_CONTENT
        return { "msg": "Cookie provided is invalid"}
    
    points = db.selectval(f"SELECT points FROM TournamentTeams WHERE teamID = %s AND tournamentID = %s", team_id, tournament_id)
    points = points - 50
    db.update(f"UPDATE TournamentTeams SET points = %s WHERE teamID = %s AND tournamentID = %s", points, team_id, tournament_id)
    tournament_team_id = db.selectval(f"SELECT id FROM TournamentTeams WHERE teamID = %s AND tournamentID = %s", team_id, tournament_id)
    if tournament_id != None:
        try:
            db.insert(f"INSERT INTO HintsCompleted (taskID,tournamentTeamID) VALUES (%s,%s)", request.task_id, tournament_team_id)
        except:
            response.status_code = status.HTTP_409_CONFLICT
            return { "msg": "Hint already submitted" }
        hint = db.selectval(f"SELECT hint FROM Tasks WHERE Tasks.id = %s", request.task_id)
        return { "hint": hint }
    else:
        response.status_code = status.HTTP_404_NOT_FOUND
        return { "msg": "Could not find team in tournament" }


@app.get("/hints/{tournament_id}")
async def handle_get_hints(tournament_id: int, response: Response, team_login: Optional[str] = Cookie(None)):
    team_id = get_team_id_from_cookie(team_login)
    if team_id == None:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return { "msg": "Cannot get unauthorized information about team"}
    result = db.selectall(f"SELECT Tasks.id, Tasks.hint FROM Tasks,TournamentTeams,HintsCompleted WHERE TournamentTeams.tournamentID = %s AND TournamentTeams.teamID = %s AND TournamentTeams.id = HintsCompleted.tournamentTeamID AND HintsCompleted.taskID = Tasks.id", tournament_id, team_id)

    return arrays_as_dict_array(["id", "hint"], result)


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
async def handle_post_tournament(request: PostTournamentRequest, response: Response, team_login: Optional[str] = Cookie(None)):
    if not check_admin_privileges_from_cookie(team_login):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return { "msg": "Require admin privileges to create tournament" }
    id = db.insert(f"INSERT INTO Tournaments (name, endTime) VALUES (%s, %s)", request.name, request.endTime)
    return { "id": id }


@app.patch("/tournament/{tournament_id}")
async def handle_patch_tournament(tournament_id: str, request: PatchTournamentRequest, response: Response, team_login: Optional[str] = Cookie(None)):
    if not check_admin_privileges_from_cookie(team_login):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return { "msg": "Require admin privileges to add team to tournament" }
    team_id = db.selectval("SELECT id FROM Teams WHERE teamName = %s", request.teamName)
    result = db.select("SELECT teamID from TournamentTeams WHERE teamID = %s AND tournamentID = %s", team_id, tournament_id)
    if result is not None:
        response.status_code = status.HTTP_304_NOT_MODIFIED
        return { "msg": f"Team '{request.teamName}' already exists on Tournament" }
    id = db.insert(f"INSERT INTO TournamentTeams (teamID, tournamentID, points) VALUES (%s, %s, %s)", team_id, tournament_id, 0)
    return { "id": id }


@app.delete("/tournament/{tournament_id}")
async def handle_delete_tournament(tournament_id: str, response: Response, team_login: Optional[str] = Cookie(None)):
    if not check_admin_privileges_from_cookie(team_login):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return { "msg": "Require admin privileges to delete tournament" } 
    db.delete("DELETE FROM Tournaments WHERE id = %s", tournament_id)
    return f"Successfully deleted tournament"


@app.delete("/task/{task_id}")
async def handle_delete_tournament(task_id: str, response: Response, team_login: Optional[str] = Cookie(None)):
    if not check_admin_privileges_from_cookie(team_login):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return { "msg": "Require admin privileges to delete task" } 
    db.delete(f"DELETE from Tasks WHERE id = %s", task_id)
    return f"Successfully deleted task"


@app.delete("/team/{team_name}")
async def handle_delete_tournament(team_name: str, response: Response, team_login: Optional[str] = Cookie(None)):
    if not check_admin_privileges_from_cookie(team_login):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return { "msg": "Require admin privileges to delete team" }
    team_id = db.selectval("SELECT id FROM Teams WHERE teamName = %s", team_name)
    db.delete("DELETE FROM Teams WHERE id = %s", team_id)
    return f"Successfully deleted team"


@app.post("/register")
async def handle_register(request: RegisterRequest, response: Response):
    result = db.select(f"SELECT * FROM Teams WHERE Teams.teamName = %s", request.teamName)
    if result is not None:
        response.status_code = status.HTTP_409_CONFLICT
        return { "msg": f"Team name {request.teamName} has already been taken." }
    # Insert the team
    id = db.insert(f"INSERT INTO Teams (teamName, avatar, wins) VALUES (%s, %s, %s)", request.teamName, request.avatar, 0)

    # Insert the auth information
    salt = generate_random_string()
    password = combine_hash(salt, request.password)
    db.insert(f"INSERT INTO Auth (teamID, password, salt, admin) VALUES (%s, %s, %s, %s)", id, password, salt, False)

    cookie = generate_random_string()
    db.insert(f"INSERT INTO Cookies (teamId, cookie) VALUES (%s, %s)", id, cookie)

    response.set_cookie(key="team_login", value=cookie, httponly=True)
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
        result = arrays_as_dict(["id","teamName","avatar","wins","admin"], result)

        # Add cookie
        cookie = generate_random_string()
        db.insert(f"INSERT INTO Cookies (teamId, cookie) VALUES (%s, %s)", result["id"], cookie)

        response.set_cookie(key="team_login", value=cookie, httponly=True)
        return result
    else:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return { "msg": "Invalid Team name and password combination" }


@app.get("/session")
async def handle_session(response: Response, team_login: Optional[str] = Cookie(None)):
    if team_login != None:
        team_id = get_team_id_from_cookie(team_login)
        if team_id == None:
            response.status_code = status.HTTP_204_NO_CONTENT
            return { "msg": "Cookie provided is invalid"}
        team_result = db.select("SELECT * FROM Teams WHERE id = %s", team_id)
        auth_result = db.select("SELECT admin FROM Auth WHERE teamID = %s", team_id)
        auth_result = arrays_as_dict(["admin"], auth_result)
        team_result = list(team_result)
        team_result.append(auth_result["admin"])
        return arrays_as_dict(["id","teamName","avatar","wins","admin"], team_result)
    else:
        response.status_code = status.HTTP_204_NO_CONTENT
        return { "msg": "No cookie provided" }

@app.get("/logout")
async def handle_logout(response: Response, team_login: Optional[str] = Cookie(None)):
    if team_login != None:
        db.delete("DELETE FROM Cookies WHERE cookie = %s", team_login)
        response.delete_cookie("team_login")
        return { "msg": "Successfully logged out" }
    else:
        response.status_code = status.HTTP_204_NO_CONTENT
        return { "msg": "Not logged in" }


@app.get("/teams")
async def handle_all_teams():
    results = db.selectall("SELECT Teams.teamName FROM Teams")
    if len(results) == 0:
        return []
    return [teamName[0] for teamName in results]