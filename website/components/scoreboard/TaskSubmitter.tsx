import { Accordion, Grid, TextInput, Button, Text, Paper } from "@mantine/core";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { API_ENDPOINT } from "../../lib/constants";
import { sha256, success, isNoContent, warn } from "../../lib/utils";
import { TournamentBoardProps } from "../../pages/tournament/[id]";

type PasswordAttempt = Record<number, string>;

interface CompleteTaskData {
  taskData: number[];
  hintData: Record<number, string>;
}

type TaskSubmitterProps = Omit<TournamentBoardProps, "teams">;

const TaskSubmitter: FC<TaskSubmitterProps> = ({ tasks, tournament }) => {
  const [passwordAttempt, setPasswordAttempt] = useState(
    tasks.reduce(
      (map, task) => ((map[task.id] = ""), map),
      {} as PasswordAttempt
    )
  );
  const [completeTaskData, setCompleteTaskData] = useState<CompleteTaskData>({
    taskData: [],
    hintData: {},
  });

  const router = useRouter();

  const refresh = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    const getCompleteTaskData = async () => {
      const taskResp = await fetch(`${API_ENDPOINT}/task/${tournament.id}`, {
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
          setCompleteTaskData({
            taskData,
            hintData: hintData.reduce(
              (map, obj) => ((map[obj.id] = obj.hint), map),
              {} as Record<number, string>
            ),
          });
        }
      } else {
        setCompleteTaskData({ taskData: [], hintData: {} });
      }
    };
    getCompleteTaskData();
  }, []);

  const handleSubmitTask = async (taskID: number, password: string) => {
    const response = await fetch(`${API_ENDPOINT}/task/${tournament.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task_id: taskID,
        password: sha256(password),
      }),
      credentials: "include",
    });
    if (response.ok) {
      setCompleteTaskData({
        ...completeTaskData,
        taskData: [...completeTaskData.taskData, taskID],
      });
      success("Task completed");
      refresh();
    } else if (isNoContent(response.status)) {
      warn("Please log in before submitting task");
    }
  };

  const handleGetHint = async (taskID: string) => {
    const hint = Object.entries(completeTaskData.hintData).find(
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
      setCompleteTaskData({
        ...completeTaskData,
        hintData: { ...completeTaskData.hintData, [taskID]: hintResp.hint },
      });
      refresh();
    } else if (isNoContent(response.status)) {
      warn("Please log in before requesting hint");
    }
  };
  return (
    <Paper shadow="xs" p="xl">
      <Text>Tasks Todo:</Text>
      {tasks.length > 0 ? (
        <Accordion>
          {tasks
            .filter(
              (task) => !completeTaskData.taskData.some((t) => t === task.id)
            )
            .map((t, idx) => (
              <Accordion.Item label={t.name} key={idx}>
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
                      disabled={completeTaskData.hintData[t.id] !== undefined}
                      onClick={() => handleGetHint(t.id.toString())}
                    >
                      Get Hint?
                    </Button>
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Text>{completeTaskData.hintData[t.id] || ""}</Text>
                  </Grid.Col>
                </Grid>
              </Accordion.Item>
            ))}
        </Accordion>
      ) : (
        <Text size="sm">No active tasks</Text>
      )}
    </Paper>
  );
};

export default TaskSubmitter;
