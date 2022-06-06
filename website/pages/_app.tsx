import type { AppProps } from "next/app";
import Navigation from "../components/shared/Navigation";
import { NotificationsProvider } from "@mantine/notifications";
import Head from "next/head";
import "../styles/globals.css";

function MyApp({ Component, pageProps, ...appProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NotificationsProvider>
        <Navigation />
        <Component {...pageProps} />
        <div style={{ height: "100px" }} />
      </NotificationsProvider>
    </>
  );
}

export default MyApp;
