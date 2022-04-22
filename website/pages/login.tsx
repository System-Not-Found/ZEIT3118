import { NextPage } from "next";
import { useState } from "react";
import {
  Card,
  TextInput,
  PasswordInput,
  Text,
  Container,
  Grid,
  Button,
} from "@mantine/core";
import { FiUsers as TeamIcon, FiLock as LockIcon } from "react-icons/fi";

interface LoginData {
  teamName: string;
  password: string;
}

const handleAuthentication = (loginData: LoginData) => {};

const LoginPage: NextPage = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    teamName: "",
    password: "",
  });

  return (
    <Container size="xs">
      <Card>
        <Grid align="center" justify="space-between">
          <Grid.Col>
            <Text>Login</Text>
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Team Name"
              placeholder="Team Name"
              value={loginData.teamName}
              onChange={(evt) =>
                setLoginData({ ...loginData, teamName: evt.target.value })
              }
              icon={<TeamIcon />}
              radius="md"
              required={true}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <PasswordInput
              label="Password"
              placeholder="Password"
              value={loginData.password}
              onChange={(evt) =>
                setLoginData({ ...loginData, password: evt.target.value })
              }
              icon={<LockIcon />}
              radius="md"
              required={true}
            />
          </Grid.Col>
          <Grid.Col span={10}>
            <Button onClick={() => handleAuthentication(loginData)}>
              Login
            </Button>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
};

export default LoginPage;
