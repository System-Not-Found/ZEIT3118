from pydantic import BaseModel


class PostTaskRequest(BaseModel):
    task_id: str
    password: str


class PostTasksRequest(BaseModel):
    taskName: str
    points: int
    password: str
    hint: str


class GetHintRequest(BaseModel):
    task_id: str


class PostTournamentRequest(BaseModel):
    name: str
    endTime: str

class PatchTournamentRequest(BaseModel):
    teamName: str

class LoginRequest(BaseModel):
    teamName: str
    password: str

class RegisterRequest(BaseModel):
    teamName: str
    avatar: int
    password: str