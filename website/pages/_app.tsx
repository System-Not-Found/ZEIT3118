import type { AppProps } from "next/app";
import { createContext, useEffect, useState } from "react";
import Navigation from "../components/shared/Navigation";
import { User } from "../lib/types";
import { isUnauthorized } from "../lib/utils";
import { NotificationsProvider } from "@mantine/notifications";
import { API_ENDPOINT } from "../lib/constants";
import "../styles/globals.css";

interface UserContextProps {
  user: User;
  toggleUser: (user: User) => void;
}

const emptyUser: User = {
  id: -1,
  teamName: "",
  avatar: -1,
  points: 0,
  wins: 0,
  admin: false,
};

export const UserContext = createContext<UserContextProps>({
  user: emptyUser,
  toggleUser: () => {},
});

function MyApp({ Component, pageProps, ...appProps }: AppProps) {
  const excludeNavPaths = ["/signup", "/login"];
  const includeNav = !excludeNavPaths.includes(appProps.router.pathname);

  const [user, setUser] = useState<User>(emptyUser);

  useEffect(() => {
    async function validateSession(): Promise<void> {
      const response = await fetch(`${API_ENDPOINT}/session`, {
        credentials: "include",
      });
      if (response.status === 200) {
        const user = await response.json();
        setUser(user);
      } else {
        setUser(emptyUser);
      }
    }
    validateSession();
  }, []);

  return (
    <NotificationsProvider>
      <UserContext.Provider value={{ user, toggleUser: setUser }}>
        {includeNav ? <Navigation id={user.id} avatar={user.avatar} /> : <></>}
        <Component {...pageProps} />
      </UserContext.Provider>
    </NotificationsProvider>
  );
}

export default MyApp;
