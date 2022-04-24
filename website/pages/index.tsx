import { useState } from "react";
import { Container } from "@mantine/core";
import { FiSettings } from "react-icons/fi";
import type { NextPage } from "next";
import { Tournament } from "../lib/types";
import ScoreScreen from "../components/ScoreScreen";
import TournamentScreen from "../components/TournamentScreen";

const Home: NextPage = () => {
  const [open, setOpen] = useState(false);
  const [tournament, setTournament] = useState<Tournament>();

  return (
    <Container size="lg">
      <FiSettings
        size="25px"
        style={{ cursor: "pointer", float: "right" }}
        onClick={() => setOpen(true)}
      />
      {tournament ? (
        <ScoreScreen />
      ) : (
        <TournamentScreen setTournament={setTournament} />
      )}
    </Container>
  );
};

export default Home;
