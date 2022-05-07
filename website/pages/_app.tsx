import type { AppProps } from "next/app";
import { createContext, useEffect, useState } from "react";
import Navigation from "../components/shared/Navigation";
import { User } from "../lib/types";
import { isUnauthorized } from "../lib/utils";
import { NotificationsProvider } from "@mantine/notifications";
import "../styles/globals.css";
import { API_ENDPOINT } from "../lib/constants";

interface UserContextProps {
  user: User;
  toggleUser: (user: User) => void;
}

const emptyUser: User = {
  id: -1,
  name: "",
  avatar: -1,
  points: 0,
  wins: 0,
  admin: false,
};

function MyApp({ Component, pageProps, ...appProps }: AppProps) {
  const excludeNavPaths = ["/signup", "/login"];
  const includeNav = !excludeNavPaths.includes(appProps.router.pathname);

  return (
    <NotificationsProvider>
      {includeNav ? <Navigation /> : <></>}
      <Component {...pageProps} />
    </NotificationsProvider>
  );
}

export default MyApp;
