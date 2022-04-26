import sjcl from "sjcl";
import { API_ENDPOINT } from "./constants";
import { Team, Tournament } from "./types";

// Status Codes
export const isUnauthorized = (status: number) => {
  return status === 401;
};

export const isNotFound = (status: number) => {
  return status === 404;
};

export const isConflict = (status: number) => {
  return status === 409;
};

interface Time {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export const convertFromTimeString = (timeString: string): Time => {
  return {
    minute: Number.parseInt(timeString.substring(0, 2)),
    hour: Number.parseInt(timeString.substring(2, 4)),
    day: Number.parseInt(timeString.substring(4, 6)),
    month: Number.parseInt(timeString.substring(6, 8)),
    year: Number.parseInt(timeString.substring(8)),
  } as Time;
};

export const getEndTime = (timeString: string): string => {
  const time = convertFromTimeString(timeString);
  return `Ending on: ${time.day}/${time.month}/${time.year} at ${time.hour}:${time.minute}`;
};

export const convertToTimeString = (date: Date, time: Date): string => {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${time.getMinutes()}${time.getHours()}${date.getDate()}${month}${date.getFullYear()}`;
};

export const isInPast = (dateString: string): boolean => {
  const time = convertFromTimeString(dateString);
  const now = new Date();
  return (
    time.year < now.getFullYear() &&
    time.month < now.getMonth() &&
    time.day < now.getDay() &&
    time.hour < now.getHours() &&
    time.minute < now.getMinutes()
  );
};

export const hash_password = (password: string) => {
  const bits = sjcl.hash.sha256.hash(password);
  return sjcl.codec.hex.fromBits(bits);
};

export const getTournamentData = async (id: string) => {
  const tournamentResp = await fetch(`${API_ENDPOINT}/tournament/${id}`);
  const tournament = (await tournamentResp.json()) as Tournament;

  const teamsResp = await fetch(`${API_ENDPOINT}/teams/${id}`);
  const teams = (await teamsResp.json()) as Team[];
  return {
    tournament,
    teams,
  };
};

export const getAllTournamentIds = async () => {
  const response = await fetch(`${API_ENDPOINT}/tournaments`);
  const tournaments = (await response.json()) as Tournament[];
  return tournaments.map((t) => {
    return {
      params: {
        id: t.id.toString(),
      },
    };
  });
};
