import { Grid, TextInput, Button, Text } from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { FC, useState } from "react";
import { API_ENDPOINT } from "../../../lib/constants";
import { Tournament } from "../../../lib/types";
import {
  warn,
  error,
  success,
  isInPast,
  convertToTimeString,
  isConflict,
  isUnauthorized,
  logNetworkCall,
} from "../../../lib/utils";
import { GlobalSettingsData } from "./AdminSettings";

const CreateTournamentForm: FC<GlobalSettingsData> = ({ refresh }) => {
  const [tournamentName, setTournamentName] = useState<string>("");
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());

  const createTournament = async () => {
    if (tournamentName == "") {
      warn("Tournament name cannot be empty.");
      return;
    }
    if (isInPast(convertToTimeString(endDate, endTime))) {
      warn("Tournament end dates should not be in the past.");
      return;
    }
    fetch(`${API_ENDPOINT}/tournament`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: tournamentName,
        endTime: convertToTimeString(endDate, endTime),
      } as Omit<Tournament, "id">),
      credentials: "include",
    })
      .then(
        logNetworkCall("Unable to create tournament. Please try again later.")
      )
      .then((response) => {
        if (response.ok) {
          refresh();
        }
      });
  };

  return (
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
        <Button
          disabled={tournamentName === ""}
          onClick={() => createTournament()}
        >
          Create Tournament
        </Button>
      </Grid.Col>
    </Grid>
  );
};

export default CreateTournamentForm;
