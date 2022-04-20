import { Container } from '@mantine/core';
import { useState } from 'react';
import { Team } from '../lib/types';
import ScoreCard from './ScoreCard';
import { socket } from '../lib/socket';

const defaultTeam: Team[] = [
  {
    name: "Cyber Red",
    score: 100,
    players: [],
  },
  {
    name: "Cyber Blue",
    score: 1000,
    players: [],
  },
  {
    name: "Cyber Purple",
    score: 900,
    players: [],
  },
  {
    name: "Cyber Green",
    score: 0,
    players: [],
  },
  {
    name: "Cyber Orange",
    score: 1,
    players: [],
  }
]

const Scoreboard = () => {
  const [teams, setTeams] = useState(defaultTeam);
  socket.onmessage = (event) => {
    console.log(`[message] browser received ${event.data}`)
    setTeams(JSON.parse(event.data));
  }
  return (
    <Container size="xl">
      {teams
        .sort((a, b) => b.score - a.score)
        .map((team, idx) => (
          <ScoreCard 
            key={idx}
            index={idx+1}
            {...team}
          />
        ))
      }
    </Container>
  )
}

export default Scoreboard;