import useSWR, { Fetcher } from "swr";
import { API_ENDPOINT } from "./constants";
import { Tournament, User } from "./types";

export const getUser = (endpoint: string) =>
  fetch(endpoint).then((res) => res.json() as Promise<User>);

export const getTournaments = (endpoint: string) =>
  fetch(endpoint).then((res) => res.json() as Promise<Tournament[]>);

interface SWRHook {
  isLoading: boolean;
  isError: boolean;
}

interface SessionHook extends SWRHook {
  user: User | undefined;
}

interface TournamentsHook extends SWRHook {
  tournaments: Tournament[];
}

export function useSession(): SessionHook {
  const { data, error } = useSWR<User>(`${API_ENDPOINT}/session`, getUser);

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useTournaments(): TournamentsHook {
  const { data, error } = useSWR(`${API_ENDPOINT}/tournament`, getTournaments);
  return {
    tournaments: data ?? [],
    isLoading: !error && !data,
    isError: error,
  };
}
