import useSWR from "swr";
import { API_ENDPOINT } from "./constants";
import { Tournament, User } from "./types";

export const fetcher = (...args: string[]) =>
  fetch(...args).then((res) => res.json());

interface SWRHook {
  isLoading: boolean;
  isError: boolean;
}

interface SessionHook extends SWRHook {
  user: User;
}

interface TournamentsHook extends SWRHook {
  tournaments: Tournament[];
}

export function useSession(): SessionHook {
  const { data, error } = useSWR(`${API_ENDPOINT}/session`, fetcher);

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useTournaments(): TournamentsHook {
  const { data, error } = useSWR(`${API_ENDPOINT}/tournament`, fetcher);
  return {
    tournaments: data,
    isLoading: !error && !data,
    isError: error,
  };
}
