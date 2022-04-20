import { useState } from 'react';
import Scoreboard from '../components/Scoreboard/Scoreboard'
import { Container, Center, Box, Drawer, Text } from '@mantine/core';
import Timer from '../components/Scoreboard/Timer';
import { FiSettings } from 'react-icons/fi'
import type { NextPage } from 'next'
import SettingsDrawer from '../components/Settings/SettingsDrawer';

const Home: NextPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <Container size="lg">
      <Box>
        <FiSettings 
          size="25px" 
          style={{ cursor: "pointer", float: 'right' }}
          onClick={() => setOpen(true)}
        />
        <Center>
          <Timer year={2022} month={2} day={19} hour={19} minute={20} second={100}/>
        </Center>
      </Box>
      <SettingsDrawer position="right" size="xl" opened={open} onClose={() => setOpen(false)}/>
      <Scoreboard/>
    </Container>
  )
}

export default Home;
