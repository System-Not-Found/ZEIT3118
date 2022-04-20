import { FC, useState, useContext } from 'react';
import { Drawer, DrawerProps, Container, Text, Button, Group } from '@mantine/core';
import Login from './Login';
import Register from './Register';
import { UserContext } from '../../pages/_app';
import AdminSettings from './AdminSettings';
import TeamSettings from './TeamSettings';
import { uuid } from 'short-uuid';

export interface UserProps {
  email: string;
  teamName: string;
  password: string;
  confirmPassword: string; 
}

export interface LoginFormProps {
  swap: () => void;
  register: (user: UserProps) => void;
}

const SettingsDrawer: FC<DrawerProps> = (props) => {
  const [register, setRegister] = useState(true);
  const { user, toggleUser } = useContext(UserContext);

  const registerUser = (newUser: UserProps) => {
    const id = uuid(); // register new user, return user id
    toggleUser({ id, name: newUser.teamName, admin: false });
  }

  const loginUser = (newUser: UserProps) => {
    const id = uuid(); // login user, return user id check if admin
    toggleUser({ id: id, name: newUser.teamName, admin: false });
  }

  const loggedIn = () => {
    return user.id !== "";
  }

  const logOut = () => {
    toggleUser({ id: "", name: "", admin: false })
  }

  return (
    <Drawer {...props}>
      <Container>
        {!loggedIn() ?
          register ?
            <Register swap={setRegister.bind(null, false)} register={registerUser}/> :
            <Login swap={setRegister.bind(null, true)} register={loginUser}/> :
          <Group direction="column">
            {user.admin ?
              <AdminSettings/> :
              <TeamSettings/>}
            <Button onClick={() => logOut()}>Log Out</Button>
          </Group>
        }
      </Container>
    </Drawer>
  )
}

export default SettingsDrawer;