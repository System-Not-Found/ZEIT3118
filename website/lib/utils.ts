import { showNotification } from "@mantine/notifications";
import sjcl from "sjcl";
import { AVATAR_NAMES } from "./constants";

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

export const logNetworkCall = (err: string) => logResponse.bind(null, err);
export const logResponse = async (err: string, response: Response) => {
  if (isInternalServerError(response.status)) {
    error(err);
  } else if (isNoContent(response.status)) {
    return response;
  }
  const { msg } = await response.json();
  if (msg) {
    if (isSuccess(response.status)) {
      success(msg);
    } else if (
      isConflict(response.status) ||
      isNotFound(response.status) ||
      isUnmodified(response.status)
    ) {
      warn(msg);
    } else if (isInternalServerError(response.status)) {
      error(err);
    } else if (isNoContent(response.status)) {
      return response;
    } else {
      error("An unexpected error occured...");
    }
  }
  return response;
};
// Status Codes

export const isSuccess = (status: number) => {
  return status == 200;
};

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

export const isInternalServerError = (status: number) => {
  return status == 500;
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

export const sha256 = (password: string) => {
  const bits = sjcl.hash.sha256.hash(password);
  return sjcl.codec.hex.fromBits(bits);
};

export const saltPassword = (salt: string, password: string): string => {
  return sha256(`${salt}${password}`);
};

export const generateRandomString = (size = 16) => {
  const ALPHABET =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < size; i++) {
    result += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return result;
};

export const getAvatarSrc = (avatarID: number) => {
  return avatarID !== -1
    ? `/avatars/${AVATAR_NAMES[avatarID]}.png`
    : `/avatars/admin.png`;
};
