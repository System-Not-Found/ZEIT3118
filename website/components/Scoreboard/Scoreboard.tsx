import { FC, useEffect, useState } from "react";
import { Team } from "../../lib/types";
import { Grid, Text, Card } from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import { API_ENDPOINT } from "../../lib/constants";

interface ScoreboardProps {}

const Scoreboard: FC<ScoreboardProps> = () => {
  const [teams, setTeams] = useState<Team[]>([]);

  const theme = useMantineTheme();

  const getColor = (rank: number): string => {
    if (rank == 0) return theme.colors.yellow[4];
    if (rank == 1) return theme.colors.gray[6];
    if (rank == 2) return theme.colors.orange[4];
    return theme.black;
  };

  return (
    <Grid>
      {teams
        .sort((a, b) => b.points - a.points)
        .map((team, idx) => (
          <Grid.Col span={12}>
            <Card
              shadow="xs"
              p="lg"
              sx={(theme) => ({
                backgroundColor: theme.colors.gray[0],
              })}
            >
              <Text size="xl" color={getColor(idx)}>
                {team.teamName}
              </Text>
              <Text size="lg">Score: {team.points}</Text>
            </Card>
          </Grid.Col>
        ))}
    </Grid>
  );
};

export default Scoreboard;
