import { Tournament } from "../lib/types";
import { useState, useEffect, FC } from "react";
import { API_ENDPOINT } from "../lib/constants";
import { Card, Text } from "@mantine/core";

interface Props {
  setTournament: (tournament: Tournament) => void;
}

const TournamentScreen: FC<Props> = ({ setTournament }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    async function getTournaments(): Promise<void> {
      const response = await fetch(`${API_ENDPOINT}/tournaments`);
      if (response.ok) {
        const tournaments = await response.json();
        setTournaments(tournaments);
      }
    }
    getTournaments();
  }, []);
  return (
    <>
      {tournaments[0] ? (
        tournaments.map((tournament) => <TournamentCard {...tournament} />)
      ) : (
        <Text>There are no active tournaments</Text>
      )}
    </>
  );
};

const TournamentCard: FC<Tournament> = ({ name, endTime }) => {
  return (
    <Card>
      <Text>{name}</Text>
    </Card>
  );
};

export default TournamentScreen;
