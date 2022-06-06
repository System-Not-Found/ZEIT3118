import { convertFromTimeString, getAvatarSrc } from "../../lib/utils";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Team, Tournament, KnownTask } from "../../lib/types";
import { Container, Text, Paper, Grid, Avatar } from "@mantine/core";
import Timer from "../../components/shared/Timer";
import TaskSubmitter from "../../components/scoreboard/TaskSubmitter";
import { useSession } from "../../lib/hooks";
import prisma from "../../lib/prisma";

export interface TournamentBoardProps {
  tournament: Tournament;
  teams: Omit<Team, "wins">[];
  tasks: KnownTask[];
}

const TournamentBoard: InferGetServerSidePropsType<
  typeof getServerSideProps
> = ({ tournament, teams, tasks }: TournamentBoardProps) => {
  const { user, isLoading } = useSession();

  return (
    <Container size="lg">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginBottom: "40px",
        }}
      >
        <Text size="xl" weight="bolder">
          {tournament.name}
        </Text>
        <Timer {...convertFromTimeString(tournament.endTime)} />
      </div>
      <Grid
        sx={{
          flexDirection: "row",
          "@media (max-width: 800px)": { flexDirection: "column-reverse" },
        }}
      >
        <Grid.Col sm={12} md={user ? 8 : 12}>
          {teams.length > 0 ? (
            teams
              .sort((a, b) => b.points - a.points)
              .map((t, idx) => (
                <Paper key={idx} shadow="xs" p="xl">
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
            <Paper shadow="xs" p="xl">
              <Text size="md">No teams added to tournament.</Text>
            </Paper>
          )}
        </Grid.Col>
        {user && teams.some(t => t.name === user.name) ? (
          <Grid.Col sm={12} md={4}>
            <TaskSubmitter tasks={tasks} tournament={tournament} />
          </Grid.Col>
        ) : (
          <></>
        )}
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
  return await prisma.tournament.findUnique({
    where: {
      id: tournamentId,
    },
    select: {
      id: true,
      name: true,
      endTime: true,
    },
  });
};

const getTeamData = async (tournamentId: number) => {
  const results = await prisma.tournamentTeam.findMany({
    where: {
      tournamentId,
    },
    select: {
      completedHint: {
        select: {
          id: true,
        },
      },
      completedTask: {
        select: {
          task: {
            select: {
              points: true,
            },
          },
        },
      },
      team: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  return results.map((result) => ({
    ...result.team,
    points:
      result.completedTask.reduce((prev, curr) => 
        prev + curr.task.points,
      result.completedHint.length * -50),
  }));
};

const getTaskData = async () => {
  return await prisma.task.findMany({
    select: {
      id: true,
      name: true,
      points: true,
    },
  });
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
