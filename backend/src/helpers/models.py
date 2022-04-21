from pydantic import BaseModel





class PostTasksRequest(BaseModel):
    task_id: str
    tournamentTeam: str


class GetHintRequest(BaseModel):
    team_id: str


class PostTournamentRequest(BaseModel):
    name: str
    endTime: str

class PatchTournamentRequest(BaseModel):
    team_id: str