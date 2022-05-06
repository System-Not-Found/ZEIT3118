import { useState, useEffect, FC } from "react";
import type { NextPage } from "next";
import { Tournament } from "../lib/types";
import { Paper, Grid, Text, Container, Stack } from "@mantine/core";
import Link from "next/link";
import { API_ENDPOINT } from "../lib/constants";
import { getEndTime, isInPast } from "../lib/utils";

const Home: NextPage = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  const activeTournaments = tournaments.filter(
    ({ endTime }) => endTime && !isInPast(endTime)
  );

  const pastTournaments = tournaments.filter(
    ({ endTime }) => endTime && isInPast(endTime)
  );

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
        <>
          <Text size="lg" sx={(theme) => ({ paddingTop: theme.spacing.xl })}>
            Active Tournaments:
          </Text>
          <Grid align="center">
            {activeTournaments.map((tournament, idx) => (
              <TournamentCard key={`active-${idx}`} {...tournament} />
            ))}
          </Grid>
          <Text size="lg" sx={(theme) => ({ paddingTop: theme.spacing.xl })}>
            Past Tournaments:
          </Text>
          <Grid align="center">
            {pastTournaments.map((tournament, idx) => (
              <TournamentCard key={idx} {...tournament} />
            ))}
          </Grid>
        </>
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
          shadow="md"
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
