import {
  Autocomplete,
  Button,
  Container,
  Grid,
  TextInput,
  Text,
  Space,
  Paper,
  PasswordInput,
  Textarea,
  NumberInput,
} from "@mantine/core";
import { NextPage } from "next";
import { useState, useEffect, FC } from "react";
import { API_ENDPOINT } from "../../lib/constants";
import { Task, Tournament } from "../../lib/types";
import { convertToTimeString } from "../../lib/utils";
import { DatePicker, TimeInput } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";

const AdminSettings: FC = () => {
  const [tournamentName, setTournamentName] = useState<string>("");
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());

  const [allNames, setAllNames] = useState<string[]>([]);
  const [allTournaments, setAllTournaments] = useState<Tournament[]>([]);

  const [team, setTeam] = useState("");
  const [tournament, setTournament] = useState<Tournament>({
    id: -1,
    name: "",
    endTime: "",
  });

  const [task, setTask] = useState<Omit<Task, "id">>({
    taskName: "",
    points: 0,
    key: "",
    hint: "",
  });

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function getAllNames(): Promise<void> {
      const response = await fetch(`${API_ENDPOINT}/teams`);
      const teams = await response.json();
      setAllNames(teams);
    }

    async function getTournaments(): Promise<void> {
      const response = await fetch(`${API_ENDPOINT}/tournaments`);
      const tournaments = await response.json();
      setAllTournaments(tournaments);
    }

    getAllNames();
    getTournaments();

    setRefresh(false);
  }, [refresh]);

  const createTournament = async () => {
    const response = await fetch(`${API_ENDPOINT}/tournament`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: tournamentName,
        endTime: convertToTimeString(endDate, endTime),
      } as Omit<Tournament, "id">),
    });
    if (response.ok) {
      setRefresh(true);
      showNotification({
        message: "Successfully created tournament!",
        color: "green",
      });
    } else {
      showNotification({
        message: "Unable to create tournament. Please try again.",
        color: "red",
      });
    }
  };

  const addTeamToTournament = async () => {
    const response = await fetch(`${API_ENDPOINT}/${tournament.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName: team }),
    });
    if (response.ok) {
      showNotification({
        message: `Successfully added '${team}' to tournament '${tournament.name}'!`,
        color: "green",
      });
    } else {
      showNotification({
        message: `Unable to add ${team} to tournament.`,
        color: "red",
      });
    }
  };

  const addTask = async () => {
    const response = await fetch(`${API_ENDPOINT}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (response.ok) {
      showNotification({
        message: `Successfully created new task!`,
        color: "green",
      });
    } else {
      showNotification({
        message: "Unable to create task.",
        color: "red",
      });
    }
  };

  return (
    <Container size="lg">
      <Paper shadow="xs" p="lg">
        <Text size="xl" weight="bold">
          Tournaments
        </Text>
        <Grid gutter="sm">
          <Grid.Col>
            <Text size="lg">Create new Tournament</Text>
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Name of Tournament"
              placeholder="New Tournament"
              value={tournamentName}
              onChange={(evt) => setTournamentName(evt.target.value)}
              required
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <DatePicker
              label="End date of Tournament"
              value={endDate}
              onChange={(evt) => setEndDate(evt ?? new Date())}
              required
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TimeInput
              label="End time of Tournament"
              placeholder={Date.now().toFixed()}
              value={endTime}
              onChange={setEndTime}
              required
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Button onClick={() => createTournament()}>
              Create Tournament
            </Button>
          </Grid.Col>
        </Grid>
        <Space h="md" />
        <Grid gutter="sm">
          <Grid.Col>
            <Text size="lg">Add Team to Tournament</Text>
          </Grid.Col>
          <Grid.Col>
            <Autocomplete
              label="Choose a tournament"
              placeholder="Tournament 1"
              data={allTournaments.map((tournament) => tournament.name)}
              value={tournament.name}
              onChange={(evt) => setTournament((t) => ({ ...t, name: evt }))}
              required
            />
          </Grid.Col>
          <Grid.Col>
            <Autocomplete
              label="Choose team to add to tournament"
              placeholder="Cyber Red"
              data={allNames}
              value={team}
              onChange={setTeam}
              required
            />
          </Grid.Col>
          <Grid.Col>
            <Button onClick={() => addTeamToTournament()}>Add Team</Button>
          </Grid.Col>
        </Grid>
      </Paper>
      <Space h="xl" />
      <Paper shadow="xs" p="lg">
        <Text size="xl" weight="bold">
          Tasks
        </Text>
        <Grid>
          <Grid.Col span={12}>
            <Text size="lg">Create new Task</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Name"
              placeholder="Task 1"
              required
              onChange={(evt) =>
                setTask({ ...task, taskName: evt.target.value })
              }
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
              onChange={(evt) => setTask({ ...task, key: evt.target.value })}
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
            <Button onClick={() => addTask()}>Create Task</Button>
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AdminSettings;
