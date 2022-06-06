import { Grid, Button, Select } from "@mantine/core";
import { FC, useState } from "react";
import { API_ENDPOINT } from "../../../lib/constants";
import { logNetworkCall } from "../../../lib/utils";
import { GlobalSettingsData } from "./AdminSettings";

const DeleteTaskForm: FC<GlobalSettingsData> = ({ refresh, tasks }) => {
  const [task, setTask] = useState({ id: -1, name: "" });

  const handleDeleteTask = async (): Promise<void> => {
    fetch(`${API_ENDPOINT}/task`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task.id }),
    })
      .then(logNetworkCall("Unable to delete task. Please try again later."))
      .then((response) => {
        if (response.ok) {
          setTask({ id: -1, name: "" });
          refresh();
        }
      });
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
