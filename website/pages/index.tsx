import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Scoreboard from "../components/Scoreboard";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Cyber Scoreboard</title>
        <meta name="description" content="Scoreboard for Cyber Module" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Scoreboard />
    </div>
  );
};

export default Home;
