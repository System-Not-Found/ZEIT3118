import { NextPage } from "next";
import { useState, useContext } from "react";
import {
  Card,
  TextInput,
  PasswordInput,
  Text,
  Container,
  Grid,
  Button,
} from "@mantine/core";
import { Users, Lock } from "tabler-icons-react";
import { hash_password, isNotFound, isUnauthorized } from "../lib/utils";
import { UserContext } from "./_app";
import { showNotification } from "@mantine/notifications";

interface LoginData {
  teamName: string;
  password: string;
}

const LoginPage: NextPage = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    teamName: "",
    password: "",
  });
  const context = useContext(UserContext);

  const handleAuthenticate = async (loginData: LoginData) => {
    const password = hash_password(loginData.password);
    const response = await fetch("http://localhost:3001/login", {
      body: JSON.stringify({ ...loginData, password }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    if (response.ok) {
      showNotification({
        message: "Successfully logged in",
        color: "green",
      });
      const user = await response.json();
      context.toggleUser(user);
      window.location.replace("/");
    } else if (isUnauthorized(response.status) || isNotFound(response.status)) {
      showNotification({
        message: "Invalid username and password combination",
        color: "red",
      });
    }
  };

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
              icon={<Users />}
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
              icon={<Lock />}
              radius="md"
              required={true}
            />
          </Grid.Col>
          <Grid.Col span={10}>
            <Button onClick={() => handleAuthenticate(loginData)}>Login</Button>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
};

export default LoginPage;
