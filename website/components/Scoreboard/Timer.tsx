import { FC, useState, useEffect } from "react";
import { Card, Text } from "@mantine/core";

interface TimerProps {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

interface TimeLeft {
  day: number;
  hour: number;
  minute: number;
  second: number;
}

const Timer: FC<TimerProps> = ({ year, month, day, hour, minute }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference =
      +new Date(year, month - 1, day, hour, minute) - +new Date();

    let timeLeft: TimeLeft = { day: 0, hour: 0, minute: 0, second: 0 };
    if (difference > 0) {
      timeLeft = {
        day: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hour: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minute: Math.floor((difference / 1000 / 60) % 60),
        second: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  return (
    <Card>
      <Text size="xl" weight="bold">
        {Object.entries(timeLeft).every(([_, val]) => val === 0)
          ? "Times Up!"
          : `Time Left: ${timeLeft.day} Days ${timeLeft.hour} Hours ${timeLeft.minute} Minutes ${timeLeft.second} Seconds`}
      </Text>
    </Card>
  );
};

export default Timer;
