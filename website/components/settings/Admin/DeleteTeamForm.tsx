import { Grid, Button, Select } from "@mantine/core";
import { FC, useState } from "react";
import { API_ENDPOINT } from "../../../lib/constants";
import { logNetworkCall } from "../../../lib/utils";
import { GlobalSettingsData } from "./AdminSettings";

const DeleteTeamForm: FC<GlobalSettingsData> = ({ refresh, teamNames }) => {
  const [team, setTeam] = useState("");

  const handleDeleteTeam = async (): Promise<void> => {
    fetch(`${API_ENDPOINT}/teams/`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName: team }),
    })
      .then(logNetworkCall("Unable to delete team. Please try again later."))
      .then((response) => {
        if (response.ok) {
          setTeam("");
          refresh();
        }
      });
  };
  return (
    <Grid>
      <Grid.Col span={12}>
        <Select
          label="Choose team to delete"
          placeholder="Team Name"
          data={teamNames
            .filter((name) => name !== "Admin")
            .map((name) => ({
              value: name,
              label: name,
            }))}
          value={team}
          onChange={(evt) => setTeam(evt || "")}
          required
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <Button disabled={team === ""} onClick={() => handleDeleteTeam()}>
          Delete Team
        </Button>
      </Grid.Col>
    </Grid>
  );
};

export default DeleteTeamForm;
