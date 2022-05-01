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
import {
  convertToTimeString,
  error,
  hashPassword,
  isConflict,
  isInPast,
  isUnModified,
  success,
  warn,
} from "../../lib/utils";
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
    password: "",
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
    if (tournamentName == "") {
      warn("Tournament name cannot be empty.");
      return;
    }
    if (isInPast(convertToTimeString(endDate, endTime))) {
      warn("Tournament end dates should not be in the past.");
      return;
    }
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
      success("Successfully created tournament!");
    } else if (isConflict(response.status)) {
      warn("Tournament with that name already exists");
    } else {
      error("Unable to create tournament. Please try again.");
    }
  };

  const addTeamToTournament = async () => {
    if (tournament.id === -1) {
      warn("Cannot add a team to an empty tournament.");
      return;
    }
    if (team === "") {
      warn("Cannot add an empty team to a tournament.");
      return;
    }
    const response = await fetch(
      `${API_ENDPOINT}/tournament/${tournament.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamName: team }),
      }
    );
    if (response.ok) {
      success(
        `Successfully added '${team}' to tournament '${tournament.name}'!`
      );
    } else if (isUnModified(response.status)) {
      warn(`Team already exists in tournament.`);
    } else {
      error(`Unable to add ${team} to tournament.`);
    }
  };

  const addTask = async () => {
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
    });
    if (response.ok) {
      success(`Successfully created new task!`);
    } else {
      error("Unable to create task.");
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
              onChange={(evt) =>
                setTournament(
                  (t) =>
                    allTournaments.find(
                      (tournament) => tournament.name === evt
                    ) || t
                )
              }
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
            <Text size="sm" style={{ fontStyle: "italic" }}>
              Note: Tasks will be available for teams to submit on all
              tournaments
            </Text>
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
              onChange={(evt) =>
                setTask({ ...task, password: evt.target.value })
              }
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
        <Grid>
          <></>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AdminSettings;
