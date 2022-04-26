import { useState, useEffect, FC } from "react";
import type { NextPage } from "next";
import { Tournament } from "../lib/types";
import { Paper, Grid, Text, Container, Stack } from "@mantine/core";
import Link from "next/link";
import { API_ENDPOINT } from "../lib/constants";
import { getEndTime, isInPast } from "../lib/utils";

const Home: NextPage = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    async function getTournaments(): Promise<void> {
      const response = await fetch(`${API_ENDPOINT}/tournaments`);
      if (response.ok) {
        const tournaments = (await response.json()) as Tournament[];
        setTournaments(tournaments);
      }
    }
    getTournaments();
  }, []);

  return (
    <Container size="lg">
      {tournaments ? (
        <Stack justify="center" align="stretch">
          <Text size="lg">Active Tournaments:</Text>
          <Grid justify="center" align="center">
            {tournaments
              .filter(({ endTime }) => endTime && !isInPast(endTime))
              .map((tournament, idx) => (
                <TournamentCard key={idx} {...tournament} />
              ))}
          </Grid>
          <Text size="lg">All Tournaments:</Text>
          <Grid justify="center" align="center">
            {tournaments.map((tournament, idx) => {
              <TournamentCard key={idx} {...tournament} />;
            })}
          </Grid>
        </Stack>
      ) : (
        <Text size="md">There are no active tournaments</Text>
      )}
    </Container>
  );
};

const TournamentCard: FC<Tournament> = ({ id, name, endTime }) => {
  return (
    <Grid.Col span={6}>
      <Link href={`/tournament/${id}`}>
        <Paper
          shadow="xs"
          p="lg"
          sx={(theme) => ({
            ":hover": {
              backgroundColor: theme.colors.gray[0],
              cursor: "pointer",
            },
          })}
        >
          <Text size="md">{name}</Text>
          {endTime ? <Text size="sm">{getEndTime(endTime)}</Text> : ""}
        </Paper>
      </Link>
    </Grid.Col>
  );
};

export default Home;
