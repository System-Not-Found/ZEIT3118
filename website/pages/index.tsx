import { useState, useEffect, FC, ReactNode } from "react";
import type { NextPage } from "next";
import { Tournament } from "../lib/types";
import { Paper, Grid, Text, Container, Skeleton } from "@mantine/core";
import Link from "next/link";
import { getEndTime, isInPast } from "../lib/utils";
import { useTournaments } from "../lib/hooks";

const Home: NextPage = () => {
  const { tournaments, isLoading } = useTournaments();

  let activeTournaments = [] as ReactNode[];
  let pastTournaments = [] as ReactNode[];
  if (!isLoading) {
    activeTournaments = tournaments
      .filter(({ endTime }) => endTime && !isInPast(endTime))
      .map((tournament, idx) => (
        <TournamentCard key={`active-${idx}`} {...tournament} />
      ));

    pastTournaments = tournaments
      .filter(({ endTime }) => endTime && isInPast(endTime))
      .map((tournament, idx) => <TournamentCard key={idx} {...tournament} />);
  }

  return (
    <Container size="lg">
      {isLoading ? (
        <>
          <Text size="lg" sx={(theme) => ({ paddingTop: theme.spacing.xl })}>
            Active Tournaments:
          </Text>{" "}
          <Grid>
            {[1, 2, 3].map((key) => (
              <Grid.Col key={key} span={4}>
                <Skeleton height={20} mt={6} radius="xl" width="60%" />
                <Skeleton height={15} mt={6} radius="xl" />
                <Skeleton height={15} mt={6} radius="xl" />
              </Grid.Col>
            ))}
          </Grid>
          <Text size="lg" sx={(theme) => ({ paddingTop: theme.spacing.xl })}>
            Past Tournaments:
          </Text>
          <Grid>
            {[1, 2].map((key) => (
              <Grid.Col key={key} span={4}>
                <Skeleton height={20} mt={6} radius="xl" width="60%" />
                <Skeleton height={15} mt={6} radius="xl" />
                <Skeleton height={15} mt={6} radius="xl" />
              </Grid.Col>
            ))}
          </Grid>
        </>
      ) : tournaments ? (
        <>
          {activeTournaments.length > 0 ? (
            <>
              <Text
                size="lg"
                sx={(theme) => ({
                  paddingBottom: theme.spacing.lg,
                })}
              >
                Active Tournaments:
              </Text>
              <Grid align="center">{activeTournaments}</Grid>{" "}
            </>
          ) : (
            <></>
          )}
          {pastTournaments.length > 0 ? (
            <>
              <Text
                size="lg"
                sx={(theme) => ({
                  paddingBottom: theme.spacing.lg,
                  paddingTop: activeTournaments.length > 0 ? "75px" : 0,
                })}
              >
                Past Tournaments:
              </Text>
              <Grid align="center">{pastTournaments}</Grid>{" "}
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <Paper shadow="sm">
          <Text size="md">There are no tournaments</Text>
        </Paper>
      )}
    </Container>
  );
};

const TournamentCard: FC<Tournament> = ({ id, name, endTime }) => {
  return (
    <Grid.Col span={6}>
      <Link href={`/tournament/${id}`} passHref={true}>
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
