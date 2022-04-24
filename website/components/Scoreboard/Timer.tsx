import { FC, useState, useEffect } from "react";
import { Card, Text } from '@mantine/core';

interface TimerProps {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Timer: FC<TimerProps> = ({
  year,
  month,
  day,
  hour,
  minute,
  second,
}) => {
  const calculateTimeLeft = (): TimeLeft => {  
    const difference = +new Date(year, month, day, hour, minute, second) - +new Date();
  
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
  
    return timeLeft;
  }

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
        {timeLeft.days}D {timeLeft.hours}H {timeLeft.minutes}M {timeLeft.seconds}S
      </Text>
    </Card>
  )
}

export default Timer;