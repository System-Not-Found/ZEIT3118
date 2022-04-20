import { FC, useState } from 'react';
import { Team } from '../../lib/types';
import { Grid, Text, Card } from '@mantine/core';
import { useMantineTheme } from '@mantine/core';

interface ScoreboardProps {
}

const defaultTeams: Team[] = [
  { id: "0001", name: "Cyber Red", score: 10 },
  { id: "0002", name: "Cyber Blue", score: 100 },
  { id: "0003", name: "Cyber Green", score: 90 },
  { id: "0004", name: "Cyber Purple", score: 40 },
]

const Scoreboard: FC<ScoreboardProps> = () => {
  const [teams, setTeams] = useState<Team[]>(defaultTeams);

  const theme = useMantineTheme();

  const getColor = (rank: number): string => {
    if (rank == 0) return theme.colors.yellow[4];
    if (rank == 1) return theme.colors.gray[6];
    if (rank == 2) return theme.colors.orange[4];
    return theme.black;
  }

  return (
    <Grid>
      {teams.sort((a, b) => b.score - a.score).map((team, idx) => (
        <Grid.Col span={12}>
          <Card shadow="xs" p="lg" sx={(theme) => ({
            backgroundColor: theme.colors.gray[0],
          })}>
            <Text size="xl" color={getColor(idx)}>{team.name}</Text>
            <Text size="lg">Score: {team.score}</Text>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  )
}

export default Scoreboard;