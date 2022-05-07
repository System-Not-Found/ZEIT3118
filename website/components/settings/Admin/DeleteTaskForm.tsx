import { Grid, Button, Select } from "@mantine/core";
import { FC, useState } from "react";
import { API_ENDPOINT } from "../../../lib/constants";
import { success, error, isUnauthorized, warn } from "../../../lib/utils";
import { GlobalSettingsData } from "./AdminSettings";

const DeleteTaskForm: FC<GlobalSettingsData> = ({ refresh, tasks }) => {
  const [task, setTask] = useState({ id: -1, name: "" });

  const handleDeleteTask = async (): Promise<void> => {
    const response = await fetch(`${API_ENDPOINT}/task/${task.id}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      success("Successfully deleted task");
      setTask({ id: -1, name: "" });
      refresh();
    } else if (isUnauthorized(response.status)) {
      warn("Deleting a task requires admin privileges");
    } else {
      error("Unable to delete task");
    }
  };

  return (
    <Grid>
      <Grid.Col span={12}>
        <Select
          label="Choose task to delete"
          placeholder="Task Name"
          data={tasks.map(({ name }) => ({
            value: name,
            label: name,
          }))}
          value={task.name}
          onChange={(evt) =>
            setTask({
              id: tasks.find((task) => task.name === evt)?.id || 0,
              name: evt || "",
            })
          }
          required
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <Button disabled={task.name === ""} onClick={() => handleDeleteTask()}>
          Delete Task
        </Button>
      </Grid.Col>
    </Grid>
  );
};

export default DeleteTaskForm;
