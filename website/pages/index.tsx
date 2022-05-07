import { useState, useEffect, FC } from "react";
import type { NextPage } from "next";
import { Tournament } from "../lib/types";
import { Paper, Grid, Text, Container, Skeleton } from "@mantine/core";
import Link from "next/link";
import { getEndTime, isInPast } from "../lib/utils";
import { useTournaments } from "../lib/hooks";

const Home: NextPage = () => {
  const { tournaments, isLoading } = useTournaments();
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
          <Text size="lg" sx={(theme) => ({ paddingTop: theme.spacing.xl })}>
            Active Tournaments:
          </Text>
          <Grid align="center">
            {tournaments
              .filter(({ endTime }) => endTime && !isInPast(endTime))
              .map((tournament, idx) => (
                <TournamentCard key={`active-${idx}`} {...tournament} />
              ))}
          </Grid>
          <Text size="lg" sx={(theme) => ({ paddingTop: theme.spacing.xl })}>
            Past Tournaments:
          </Text>
          <Grid align="center">
            {tournaments
              .filter(({ endTime }) => endTime && isInPast(endTime))
              .map((tournament, idx) => (
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
      <Link href={`/tournament/${id}`} passHref={true}>
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
