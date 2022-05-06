import { showNotification } from "@mantine/notifications";
import sjcl from "sjcl";
import { API_ENDPOINT, AVATAR_NAMES } from "./constants";
import { Task, Team, Tournament, KnownTask } from "./types";

// Logging
export const success = (message: string, silent = false): void => {
  console.log(`SUCCESS: ${message}`);
  if (!silent) {
    showNotification({
      message,
      color: "green",
    });
  }
};

export const warn = (message: string, silent = false): void => {
  console.log(`WARNING: ${message}`);
  if (!silent) {
    showNotification({
      message,
      color: "yellow",
    });
  }
};
export const error = (message: string, silent = false): void => {
  console.log(`ERROR: ${message}`);
  if (!silent) {
    showNotification({
      message,
      color: "red",
    });
  }
};
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

export const isUnmodified = (status: number) => {
  return status == 304;
};

export const isNoContent = (status: number) => {
  return status == 204;
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

const padNumber = (num: number): string => num.toString().padStart(2, "0");

export const getEndTime = (timeString: string): string => {
  const time = convertFromTimeString(timeString);
  return `Ending on: ${padNumber(time.day)}/${padNumber(time.month)}/${
    time.year
  } at ${padNumber(time.hour)}:${padNumber(time.minute)}`;
};

export const convertToTimeString = (date: Date, time: Date): string => {
  return `${padNumber(time.getMinutes())}${padNumber(
    time.getHours()
  )}${padNumber(date.getDate())}${padNumber(
    date.getMonth() + 1
  )}${date.getFullYear()}`;
};

export const isInPast = (dateString: string): boolean => {
  const time = convertFromTimeString(dateString);
  const now = new Date();
  const timeDate = new Date(
    time.year,
    time.month - 1,
    time.day,
    time.hour,
    time.minute
  );
  return timeDate < now;
};

export const hashPassword = (password: string) => {
  const bits = sjcl.hash.sha256.hash(password);
  return sjcl.codec.hex.fromBits(bits);
};

export const getTournamentPageData = async (id: string) => {
  return {
    tournament: await getTournamentData(id),
    teams: await getTeamData(id),
    tasks: await getTaskData(),
  };
};

const getTournamentData = async (id: string): Promise<Tournament> => {
  const tournamentResp = await fetch(`${API_ENDPOINT}/tournament/${id}`);
  return (await tournamentResp.json()) as Tournament;
};

const getTeamData = async (id: string): Promise<Team[]> => {
  const teamsResp = await fetch(`${API_ENDPOINT}/teams/${id}`);
  return (await teamsResp.json()) as Team[];
};

const getTaskData = async (): Promise<KnownTask[]> => {
  const tasks = await fetch(`${API_ENDPOINT}/tasks`);
  return (await tasks.json()) as KnownTask[];
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

export const getAvatarSrc = (avatarID: number) => {
  return avatarID !== -1
    ? `/avatars/${AVATAR_NAMES[avatarID]}.png`
    : `/avatars/admin.png`;
};
