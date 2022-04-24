import { Box, Center } from "@mantine/core";
import Scoreboard from "./Scoreboard/Scoreboard";
import Timer from "./Scoreboard/Timer";

const ScoreScreen = () => {
  return (
    <>
      <Box>
        <Center>
          <Timer
            year={2022}
            month={2}
            day={19}
            hour={19}
            minute={20}
            second={100}
          />
        </Center>
      </Box>
      <Scoreboard />
    </>
  );
};

export default ScoreScreen;
