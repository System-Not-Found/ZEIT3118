import {
  Grid,
  TextInput,
  NumberInput,
  PasswordInput,
  Textarea,
  Button,
  Text,
} from "@mantine/core";
import { FC, useState } from "react";
import { API_ENDPOINT } from "../../../lib/constants";
import { Task } from "../../../lib/types";
import {
  warn,
  error,
  success,
  hashPassword,
  isUnauthorized,
} from "../../../lib/utils";
import { GlobalSettingsData } from "./AdminSettings";

const CreateTaskForm: FC<GlobalSettingsData> = ({ refresh }) => {
  const [task, setTask] = useState<Omit<Task, "id">>({
    taskName: "",
    points: 0,
    password: "",
    hint: "",
  });

  const createTask = async () => {
    if (task.taskName === "") {
      warn("Task name cannot be empty.");
      return;
    }
    if (task.points === 0) {
      warn("Tasks should be worth more than 0 points.");
      return;
    }
    if (task.password === "") {
      warn("Task password cannot be empty.");
      return;
    }
    const password = hashPassword(task.password);
    const response = await fetch(`${API_ENDPOINT}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, password }),
      credentials: "include",
    });
    if (response.ok) {
      success(`Successfully created new task!`);
      refresh();
    } else if (isUnauthorized(response.status)) {
      warn("Creating a task requires admin privileges");
    } else {
      error("Unable to create task.");
    }
  };

  return (
    <Grid>
      <Grid.Col span={6}>
        <TextInput
          label="Name"
          placeholder="Task 1"
          required
          onChange={(evt) => setTask({ ...task, taskName: evt.target.value })}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <NumberInput
          label="Points"
          placeholder="100"
          required
          onChange={(evt) => setTask({ ...task, points: evt ?? 0 })}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <PasswordInput
          label="Password"
          placeholder="Password1!"
          onChange={(evt) => setTask({ ...task, password: evt.target.value })}
          required
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <Textarea
          label="Hint"
          placeholder="Leave a hint for teams to redeem 100 points to get"
          onChange={(evt) =>
            setTask({ ...task, hint: evt.target.value.substring(0, 300) })
          }
          error={task.hint.length > 300 ? "Maximum of 300 characters" : ""}
        />
      </Grid.Col>
      <Grid.Col>
        <Button
          disabled={task.taskName === "" || task.password === ""}
          onClick={() => createTask()}
        >
          Create Task
        </Button>
      </Grid.Col>
    </Grid>
  );
};

export default CreateTaskForm;
