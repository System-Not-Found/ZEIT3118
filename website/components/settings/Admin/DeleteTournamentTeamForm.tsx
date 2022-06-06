import { Grid, Button, Text, Select } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { Team, Tournament } from "../../../lib/types";
import { warn, logNetworkCall } from "../../../lib/utils";
import { API_ENDPOINT } from "../../../lib/constants";
import { GlobalSettingsData } from "./AdminSettings";

const DeleteTournamentTeamForm: FC<GlobalSettingsData> = ({
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

  const deleteTeamFromTournament = async () => {
    if (tournament.id === -1) {
      warn("Cannot delete a team from an empty tournament.");
      return;
    }
    if (team === "") {
      warn("Cannot delete an empty team from a tournament.");
      return;
    }
    fetch(`${API_ENDPOINT}/teams/${tournament.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName: team }),
      credentials: "include",
    })
      .then(logNetworkCall("Unable to delete team from tournament"))
      .then((response) => {
        if (response.ok) {
          setTeam("");
        }
      });
  };

  return (
    <Grid gutter="sm">
      <Grid.Col>
        <Text size="lg">Delete Team from Tournament</Text>
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
          label="Choose team to delete from tournament"
          placeholder="Delete Team"
          data={tournamentTeams
            .filter(({ name }) => name !== "Admin")
            .filter(({ name }) => tournamentTeams.find((t) => t.name === name))
            .map(({ name }) => ({ value: name, label: name }))}
          value={team}
          onChange={(evt) => setTeam(evt ?? "")}
          required
        />
      </Grid.Col>
      <Grid.Col>
        <Button
          disabled={team === "" || tournament.name === ""}
          onClick={() => deleteTeamFromTournament()}
        >
          Delete Team
        </Button>
      </Grid.Col>
    </Grid>
  );
};

export default DeleteTournamentTeamForm;
