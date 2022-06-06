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
import {
  sha256,
  isNotFound,
  isUnauthorized,
  success,
  error,
} from "../lib/utils";
import Link from "next/link";

interface LoginData {
  teamName: string;
  password: string;
}

const LoginPage: NextPage = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    teamName: "",
    password: "",
  });

  const handleAuthenticate = async (loginData: LoginData) => {
    const password = sha256(loginData.password);
    const response = await fetch("/api/login", {
      body: JSON.stringify({ ...loginData, password }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    if (response.ok) {
      success("Successfully logged in");
      window.location.replace("/");
    } else if (isUnauthorized(response.status) || isNotFound(response.status)) {
      error("Invalid username and password combination");
    }
  };

  return (
    <Container size="sm">
      <Card shadow="lg" p="xl">
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
          <Grid.Col span={6}>
            <Button onClick={() => handleAuthenticate(loginData)}>Login</Button>
          </Grid.Col>
          <Grid.Col span={6}>
            <Link href="/signup" passHref={true}>
              <Text
                size="sm"
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    textDecoration: "underline",
                  },
                }}
              >
                Do not have an account? Sign up
              </Text>
            </Link>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
};

export default LoginPage;
