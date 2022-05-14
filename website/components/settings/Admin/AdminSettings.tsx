import { Container, Grid, Paper, Text } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { API_ENDPOINT } from "../../../lib/constants";
import { KnownTask, Tournament } from "../../../lib/types";
import {
  CreateTaskForm,
  CreateTournamentForm,
  AddTournamentTeamForm,
  DeleteTaskForm,
  DeleteTeamForm,
  DeleteTournamentForm,
} from "./";
import DeleteTournamentTeamForm from "./DeleteTournamentTeamForm";

export interface GlobalSettingsData {
  tournaments: Tournament[];
  tasks: KnownTask[];
  teamNames: string[];
  refresh: () => void;
}

export type GlobalSettingsInfo = Omit<GlobalSettingsData, "refresh">;

const AdminSettings = () => {
  const [refresh, setRefresh] = useState(false);

  const [globalSettings, setGlobalSettings] = useState<GlobalSettingsData>({
    tournaments: [],
    teamNames: [],
    tasks: [],
    refresh: () => setRefresh(true),
  });

  useEffect(() => {
    const getGlobalSettings = async (): Promise<void> => {
      const teamResp = await fetch(`${API_ENDPOINT}/teams`);
      const teamNames = await teamResp.json();

      const tournamentResp = await fetch(`${API_ENDPOINT}/tournament`);
      const tournaments = await tournamentResp.json();

      const taskResp = await fetch(`${API_ENDPOINT}/task`);
      const tasks = await taskResp.json();

      setGlobalSettings({
        tournaments,
        teamNames,
        tasks,
        refresh: () => setRefresh(true),
      });

      setRefresh(false);
    };
    getGlobalSettings();
  }, [refresh]);

  return (
    <Container size="lg">
      <SettingsSection>
        <Text size="xl" weight="bold">
          Tournaments
        </Text>
        <Grid gutter="xl">
          <Grid.Col>
            <CreateTournamentForm {...globalSettings} />
          </Grid.Col>
          <Grid.Col>
            <AddTournamentTeamForm {...globalSettings} />
          </Grid.Col>
          <Grid.Col>
            <DeleteTournamentTeamForm {...globalSettings} />
          </Grid.Col>
        </Grid>
      </SettingsSection>
      <SettingsSection>
        <Text size="xl" weight="bold">
          Tasks
        </Text>
        <Text size="lg">Create new Task</Text>
        <Text size="sm" style={{ fontStyle: "italic" }}>
          Note: Tasks will be available for teams to submit on all tournaments
        </Text>
        <CreateTaskForm {...globalSettings} />
      </SettingsSection>
      <SettingsSection>
        <Text size="xl" weight="bold">
          Delete
        </Text>
        <Grid align="center" dir="row" gutter="sm">
          <Grid.Col sm={12} md={4}>
            <DeleteTournamentForm {...globalSettings} />
          </Grid.Col>
          <Grid.Col sm={12} md={4}>
            <DeleteTaskForm {...globalSettings} />
          </Grid.Col>
          <Grid.Col sm={12} md={4}>
            <DeleteTeamForm {...globalSettings} />
          </Grid.Col>
        </Grid>
      </SettingsSection>
    </Container>
  );
};

const SettingsSection: FC = ({ children }) => {
  console.log(children);
  return (
    <Paper
      shadow="xs"
      p="lg"
      sx={(theme) => ({ marginBottom: theme.spacing.xl })}
    >
      {children}
    </Paper>
  );
};

export default AdminSettings;
