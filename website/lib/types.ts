export interface Team {
  id: number;
  teamName: string;
  points: number;
  wins: number;
}

export interface Auth {
  id: number;
  teamID: number;
  password: string;
  salt: string;
  admin: boolean;
}

export interface Task {
  id: number;
  taskName: string;
  points: number;
  key: string;
  hint: string;
}

export interface CompletedTask {
  taskID: number;
  tournamentTeamID: number;
}

export interface TournamentTeam {
  id: number;
  teamID: number;
  tournamentID: number;
}

export interface Tournament {
  id: number;
  name: string;
  endTime: string;
}

export interface Cookie {
  id: string;
  teamID: number;
}
