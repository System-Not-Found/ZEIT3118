import { convertFromTimeString, getAvatarSrc } from "../../lib/utils";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { Team, Tournament, KnownTask } from "../../lib/types";
import { Container, Text, Paper, Grid, Center, Avatar } from "@mantine/core";
import Timer from "../../components/shared/Timer";
import TaskSubmitter from "../../components/scoreboard/TaskSubmitter";
import { API_ENDPOINT } from "../../lib/constants";

export interface TournamentBoardProps {
  tournament: Tournament;
  teams: Omit<Team, "wins">[];
  tasks: KnownTask[];
}

const TournamentBoard: InferGetServerSidePropsType<
  typeof getServerSideProps
> = ({ tournament, teams, tasks }: TournamentBoardProps) => {
  return (
    <Container size="lg">
      <Center>
        <div>
          <Text size="xl" weight="bolder">
            {tournament.name}
          </Text>
          <Timer {...convertFromTimeString(tournament.endTime)} />
        </div>
      </Center>
      <Grid>
        <Grid.Col span={8}>
          {teams.length > 0 ? (
            teams
              .sort((a, b) => b.points - a.points)
              .map((t, idx) => (
                <Paper shadow="md" p="lg" key={idx}>
                  <Grid>
                    <Grid.Col span={2}>
                      <Avatar
                        src={getAvatarSrc(t.avatar)}
                        radius="lg"
                        size="lg"
                      />
                    </Grid.Col>
                    <Grid.Col span={10}>
                      <Text size="lg">{t.name}</Text>
                      <Text size="md">Points: {t.points}</Text>
                    </Grid.Col>
                  </Grid>
                </Paper>
              ))
          ) : (
            <Text size="md">No teams added to tournament.</Text>
          )}
        </Grid.Col>
        <Grid.Col span={4}>
          <TaskSubmitter tasks={tasks} tournament={tournament} />
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export const getTournamentPageData = async (id: string) => {
  const tournamentId = Number.parseInt(id);

  return {
    tournament: await getTournamentData(tournamentId),
    teams: await getTeamData(tournamentId),
    tasks: await getTaskData(),
  };
};

const getTournamentData = async (tournamentId: number) => {
  const tournaments = await fetch(`${API_ENDPOINT}/tournament/${tournamentId}`);
  return await tournaments.json();
};

const getTeamData = async (tournamentId: number) => {
  const teams = await fetch(`${API_ENDPOINT}/teams/${tournamentId}`);
  return await teams.json();
};

const getTaskData = async () => {
  const tasks = await fetch(`${API_ENDPOINT}/task`);
  return await tasks.json();
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const data = await getTournamentPageData(params["id"] as string);
  if (!data.tournament) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      ...data,
    },
  };
};

export default TournamentBoard;
