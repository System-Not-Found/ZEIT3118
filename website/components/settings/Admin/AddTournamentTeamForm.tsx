import { Grid, Button, Text, Select } from "@mantine/core";
import { FC, useState } from "react";
import { Tournament } from "../../../lib/types";
import {
  warn,
  success,
  error,
  isUnmodified,
  isUnauthorized,
} from "../../../lib/utils";
import { API_ENDPOINT } from "../../../lib/constants";
import { GlobalSettingsData } from "./AdminSettings";

const AddTournamentTeamForm: FC<GlobalSettingsData> = ({
  tournaments,
  teamNames,
}) => {
  const [team, setTeam] = useState("");
  const [tournament, setTournament] = useState<Tournament>({
    id: -1,
    name: "",
    endTime: "",
  });

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
        credentials: "include",
      }
    );
    if (response.ok) {
      success(
        `Successfully added '${team}' to tournament '${tournament.name}'!`
      );
    } else if (isUnmodified(response.status)) {
      warn(`Team already exists in tournament.`);
    } else if (isUnauthorized(response.status)) {
      warn("Adding a team to a tournament requires admin privileges");
    } else {
      error(`Unable to add ${team} to tournament.`);
    }
  };

  return (
    <Grid gutter="sm">
      <Grid.Col>
        <Text size="lg">Add Team to Tournament</Text>
      </Grid.Col>
      <Grid.Col>
        <Select
          label="Choose a tournament"
          placeholder="Tournament Name"
          data={tournaments.map((tournament) => ({
            value: tournament.name,
            label: tournament.name,
          }))}
          value={tournament.name}
          onChange={(evt) =>
            setTournament(tournaments.find((t) => t.name === evt) ?? tournament)
          }
          required
        />
      </Grid.Col>
      <Grid.Col>
        <Select
          label="Choose team to add to tournament"
          placeholder="New Team"
          data={teamNames
            .filter((name) => name !== "Admin")
            .map((name) => ({ value: name, label: name }))}
          value={team}
          onChange={(evt) => setTeam(evt ?? "")}
          required
        />
      </Grid.Col>
      <Grid.Col>
        <Button
          disabled={team === "" || tournament.name === ""}
          onClick={() => addTeamToTournament()}
        >
          Add Team
        </Button>
      </Grid.Col>
    </Grid>
  );
};

export default AddTournamentTeamForm;
