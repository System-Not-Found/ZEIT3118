import { Grid, Button, Select } from "@mantine/core";
import { FC, useState } from "react";
import { API_ENDPOINT } from "../../../lib/constants";
import { success, error, isUnauthorized, warn } from "../../../lib/utils";
import { GlobalSettingsData } from "./AdminSettings";

const DeleteTournamentForm: FC<GlobalSettingsData> = ({
  refresh,
  tournaments,
}) => {
  const [tournament, setTournament] = useState({
    id: -1,
    name: "",
  });

  const handleDeleteTournament = async (): Promise<void> => {
    const response = await fetch(
      `${API_ENDPOINT}/tournament/${tournament.id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.ok) {
      success("Successfully deleted tournament");
      setTournament({ id: -1, name: "" });
      refresh();
    } else if (isUnauthorized(response.status)) {
      warn("Deleting a tournament requires admin privileges");
    } else {
      error("Unable to delete tournament");
    }
  };

  return (
    <Grid>
      <Grid.Col span={12}>
        <Select
          label="Choose tournament to delete"
          placeholder="Tournament Name"
          data={tournaments.map((tournament) => ({
            value: tournament.name,
            label: tournament.name,
          }))}
          value={tournament.name}
          onChange={(evt) =>
            setTournament({
              ...(tournaments.find((t) => t.name === evt) ?? tournament),
            })
          }
          required
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <Button
          disabled={tournament.name === ""}
          onClick={() => handleDeleteTournament()}
        >
          Delete Tournament
        </Button>
      </Grid.Col>
    </Grid>
  );
};

export default DeleteTournamentForm;
