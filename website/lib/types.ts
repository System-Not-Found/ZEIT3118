import { Tallymarks } from "tabler-icons-react";

export interface Team {
  id: number;
  name: string;
  avatar: number;
  points: number;
  wins: number;
}

export interface User extends Team {
  admin: boolean;
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
  name: string;
  points: number;
  password: string;
  hint: string;
}

// Excludes all secret properties so they aren't being sent over the network
export type KnownTask = Omit<Task, "password" | "hint">;

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
