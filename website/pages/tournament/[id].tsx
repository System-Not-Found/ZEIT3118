import {
  getAllTournamentIds,
  getTournamentData,
  convertFromTimeString,
} from "../../lib/utils";
import { Params } from "next/dist/server/router";
import { FC } from "react";
import { Team, Tournament } from "../../lib/types";
import { Container, Text, Paper } from "@mantine/core";
import Timer from "../../components/Scoreboard/Timer";

interface TournamentProps {
  tournament: Tournament;
  teams: Team[];
}

const TournamentBoard: FC<TournamentProps> = ({ tournament, teams }) => {
  return (
    <Container>
      <Text size="lg">{tournament.name}</Text>
      <Timer {...convertFromTimeString(tournament.endTime)} />
      {teams
        .sort((a, b) => a.points - b.points)
        .map((t) => (
          <Paper shadow="xs" p="lg">
            <Text>{t.teamName}</Text>
            <Text>{t.points}</Text>
          </Paper>
        ))}
    </Container>
  );
};

export async function getStaticPaths() {
  const paths = await getAllTournamentIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: Params) {
  const data = await getTournamentData(params.id);
  const id = data.tournament.id;
  return {
    props: {
      id,
      tournament: data.tournament,
      teams: data.teams,
    },
  };
}

export default TournamentBoard;
