import { Grid, Button, Select } from "@mantine/core";
import { FC, useState } from "react";
import { success, error, isUnauthorized, warn } from "../../../lib/utils";
import { GlobalSettingsData } from "./AdminSettings";

const DeleteTeamForm: FC<GlobalSettingsData> = ({ refresh, teamNames }) => {
  const [team, setTeam] = useState("");

  const handleDeleteTeam = async (): Promise<void> => {
    const response = await fetch(`${API_ENDPOINT}/teams/`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName: team }),
    });
    if (response.ok) {
      success("Successfully deleted team");
      setTeam("");
      refresh();
    } else if (isUnauthorized(response.status)) {
      warn("Deleting a team requires admin privileges");
    } else {
      error("Unable to delete team");
    }
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
