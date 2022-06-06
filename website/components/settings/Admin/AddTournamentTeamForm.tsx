import { Grid, Button, Text, Select } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { Team, Tournament } from "../../../lib/types";
import { warn, logNetworkCall } from "../../../lib/utils";
import { API_ENDPOINT } from "../../../lib/constants";
import { GlobalSettingsData } from "./AdminSettings";

const AddTournamentTeamForm: FC<GlobalSettingsData> = ({
  tournaments,
  teamNames,
}) => {
  const [team, setTeam] = useState("");
  const [tournamentTeams, setTournamentTeams] = useState<Team[]>([]);
  const [tournament, setTournament] = useState<Tournament>({
    id: -1,
    name: "",
    endTime: "",
  });

  useEffect(() => {
    async function getTournamentTeams() {
      fetch(`${API_ENDPOINT}/teams/${tournament.id}`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }).then((response) => {
        if (response.ok) {
          response.json().then((teams) => setTournamentTeams(teams));
        } else {
          setTournamentTeams([]);
        }
      });
    }
    getTournamentTeams();
  }, [tournament]);

  const addTeamToTournament = async () => {
    if (tournament.id === -1) {
      warn("Cannot add a team to an empty tournament.");
      return;
    }
    if (team === "") {
      warn("Cannot add an empty team to a tournament.");
      return;
    }
    fetch(`${API_ENDPOINT}/teams/${tournament.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName: team }),
      credentials: "include",
    }).then(logNetworkCall(`Unable to add ${team} to tournament`));
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
            .filter((name) => !tournamentTeams.find((t) => t.name === name))
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
