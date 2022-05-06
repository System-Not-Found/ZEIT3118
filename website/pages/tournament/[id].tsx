import {
  getAllTournamentIds,
  getTournamentPageData,
  convertFromTimeString,
  isUnauthorized,
  error,
  isNoContent,
  warn,
  success,
  getAvatarSrc,
  hashPassword,
} from "../../lib/utils";
import { Params } from "next/dist/server/router";
import { FC, useEffect, useState } from "react";
import { Team, Tournament, KnownTask } from "../../lib/types";
import {
  Container,
  Text,
  Paper,
  Grid,
  Center,
  Accordion,
  Button,
  TextInput,
  Avatar,
} from "@mantine/core";
import Timer from "../../components/Scoreboard/Timer";
import { API_ENDPOINT } from "../../lib/constants";
import { useRouter } from "next/router";

interface TournamentProps {
  tournament: Tournament;
  teams: Team[];
  tasks: KnownTask[];
}

type PasswordAttempt = Record<number, string>;

interface TaskMetadata {
  taskData: number[];
  hintData: Record<number, string>;
}

const TournamentBoard: FC<TournamentProps> = ({ tournament, teams, tasks }) => {
  const [passwordAttempt, setPasswordAttempt] = useState(
    tasks.reduce(
      (map, task) => ((map[task.id] = ""), map),
      {} as PasswordAttempt
    )
  );
  const [taskMetadata, setTaskMetadata] = useState<TaskMetadata>({
    taskData: [],
    hintData: {},
  });

  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    const getTaskMetadata = async () => {
      const taskResp = await fetch(`${API_ENDPOINT}/tasks/${tournament.id}`, {
        credentials: "include",
      });
      if (taskResp.ok) {
        const taskData = await taskResp.json();

        const hintResp = await fetch(`${API_ENDPOINT}/hints/${tournament.id}`, {
          credentials: "include",
        });
        if (hintResp.ok) {
          const hintData = (await hintResp.json()) as {
            id: number;
            hint: string;
          }[];
          setTaskMetadata({
            taskData,
            hintData: hintData.reduce(
              (map, obj) => ((map[obj.id] = obj.hint), map),
              {} as Record<number, string>
            ),
          });
        }
      } else {
        setTaskMetadata({ taskData: [], hintData: {} });
      }
    };
    getTaskMetadata();
  }, []);

  const handleGetHint = async (taskID: string) => {
    const hint = Object.entries(taskMetadata.hintData).find(
      ([id, _]) => id === taskID
    );
    if (hint) return hint;

    const response = await fetch(`${API_ENDPOINT}/hints/${tournament.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task_id: taskID }),
      credentials: "include",
    });
    if (response.ok) {
      const hintResp = (await response.json()) as { hint: string };
      setTaskMetadata({
        ...taskMetadata,
        hintData: { ...taskMetadata.hintData, [taskID]: hintResp.hint },
      });
      refreshData();
    } else if (isNoContent(response.status)) {
      warn("Please log in before requesting hint");
    }
  };

  const handleSubmitTask = async (taskID: number, password: string) => {
    const response = await fetch(`${API_ENDPOINT}/tasks/${tournament.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task_id: taskID,
        password: hashPassword(password),
      }),
      credentials: "include",
    });
    if (response.ok) {
      setTaskMetadata({
        ...taskMetadata,
        taskData: [...taskMetadata.taskData, taskID],
      });
      success("Task completed");
      refreshData();
    } else if (isNoContent(response.status)) {
      warn("Please log in before submitting task");
    }
  };

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
                      <Text size="lg">{t.teamName}</Text>
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
          <Text>Tasks Todo:</Text>
          <Accordion>
            {tasks
              .filter(
                (task) => !taskMetadata.taskData.some((t) => t === task.id)
              )
              .map((t, idx) => (
                <Accordion.Item label={t.taskName} key={idx}>
                  <Grid>
                    <Grid.Col>
                      <TextInput
                        label="Task Password"
                        value={passwordAttempt[t.id]}
                        onChange={(evt) =>
                          setPasswordAttempt({
                            ...passwordAttempt,
                            [t.id]: evt.target.value,
                          })
                        }
                      ></TextInput>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Button
                        onClick={() =>
                          handleSubmitTask(t.id, passwordAttempt[t.id])
                        }
                      >
                        Submit
                      </Button>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Button
                        disabled={taskMetadata.hintData[t.id] !== undefined}
                        onClick={() => handleGetHint(t.id.toString())}
                      >
                        Get Hint?
                      </Button>
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Text>{taskMetadata.hintData[t.id] || ""}</Text>
                    </Grid.Col>
                  </Grid>
                </Accordion.Item>
              ))}
          </Accordion>
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
