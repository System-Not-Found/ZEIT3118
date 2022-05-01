import {
  getAllTournamentIds,
  getTournamentPageData,
  convertFromTimeString,
} from "../../lib/utils";
import { Params } from "next/dist/server/router";
import { FC } from "react";
import { Team, Tournament, KnownTask } from "../../lib/types";
import { Container, Text, Paper, Grid, Center, List } from "@mantine/core";
import Timer from "../../components/Scoreboard/Timer";

interface TournamentProps {
  tournament: Tournament;
  teams: Team[];
  tasks: KnownTask[];
}

const TournamentBoard: FC<TournamentProps> = ({ tournament, teams, tasks }) => {
  return (
    <Container size="lg">
      <Center>
        <div>
          <Text size="xl">{tournament.name}</Text>
          <Timer {...convertFromTimeString(tournament.endTime)} />
        </div>
      </Center>
      <Grid>
        <Grid.Col span={8}>
          {teams.length > 0 ? (
            teams
              .sort((a, b) => a.points - b.points)
              .map((t) => (
                <Paper shadow="sm" p="lg">
                  <Text>{t.teamName}</Text>
                  <Text>Points: {t.points}</Text>
                </Paper>
              ))
          ) : (
            <Text size="md">No teams added to tournament.</Text>
          )}
        </Grid.Col>
        <Grid.Col span={4}>
          <Text>Tasks:</Text>
          <List>
            {tasks.map((t) => (
              <List.Item>{t.taskName}</List.Item>
            ))}
          </List>
        </Grid.Col>
      </Grid>
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
  const data = await getTournamentPageData(params.id);
  const id = data.tournament.id;
  return {
    props: {
      id,
      ...data,
    },
  };
}

export default TournamentBoard;
