import { FC } from "react";
import { Box, Text, useMantineTheme } from "@mantine/core";
import { Team } from "../../lib/types";

interface ScoreCardProps extends Team {
  index: number;
}

const ScoreCard: FC<ScoreCardProps> = ({ index, teamName, points }) => {
  const theme = useMantineTheme();
  const colours = [
    theme.colors.orange[4],
    theme.colors.gray[5],
    theme.colors.orange[7],
  ];

  const getBorderStyles = (rank: number) => {
    if (rank > colours.length) {
      return `solid 1px ${theme.black}`;
    }
    return `solid 2px ${colours[rank - 1]}`;
  };

  return (
    <Box
      sx={(theme) => ({
        border: getBorderStyles(index),
        borderRadius: theme.radius.md,
        padding: theme.spacing.lg,
        margin: theme.spacing.md,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      })}
    >
      <div>
        <Text size="lg" sx={{ display: "inline" }}>
          {index}.{" "}
        </Text>
        <Text
          size="xl"
          sx={(theme) => ({ paddingLeft: theme.spacing.md, display: "inline" })}
        >
          {teamName}
        </Text>
      </div>
      <Text size="xl" weight="bold">
        {points}
      </Text>
    </Box>
  );
};

export default ScoreCard;
