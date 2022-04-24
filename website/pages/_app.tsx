import type { AppProps } from "next/app";
import { createContext, useState } from "react";
import { Team } from "../lib/types";

interface UserContextProps {
  user: Team;
  toggleUser: (user: Team) => void;
}

const emptyUser: Team = {
  id: 0,
  teamName: "",
  password: "",
  points: 0,
  wins: 0,
  admin: false,
};
export const UserContext = createContext<UserContextProps>({
  user: emptyUser,
  toggleUser: () => {},
});

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<Team>(emptyUser);
  return (
    <UserContext.Provider value={{ user, toggleUser: setUser }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default MyApp;
