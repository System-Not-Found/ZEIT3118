import {
  Button,
  Card,
  Container,
  Grid,
  Image,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { NextPage } from "next";
import { useState, useEffect, useContext } from "react";
import PasswordStrength from "../components/Login/PasswordStrength";
import { Users, Lock } from "tabler-icons-react";
import { API_ENDPOINT, AVATAR_NAMES } from "../lib/constants";
import { hash_password, isConflict } from "../lib/utils";
import { UserContext } from "./_app";
import { showNotification } from "@mantine/notifications";

interface RegisterData {
  teamName: string;
  avatar: number;
  password: string;
}

interface RegisterInfo extends RegisterData {
  confirmPassword: string;
}

const validTeamName = (teamName: string): boolean => {
  return teamName.length > 6;
};

const validRegisterData = (data: RegisterInfo): boolean => {
  if (data.password !== data.confirmPassword) return false;
  if (!validTeamName(data.teamName)) return false;
  return true;
};

const SignUp: NextPage = () => {
  const emptyUser = {
    teamName: "",
    avatar: 0,
    password: "",
    confirmPassword: "",
  };
  const context = useContext(UserContext);

  const [tryRegister, setTryRegister] = useState(false);
  const [user, setUser] = useState<RegisterInfo>(emptyUser);
  const [allNames, setAllNames] = useState<string[]>([]);

  useEffect(() => {
    async function getAllNames(): Promise<void> {
      const response = await fetch(`${API_ENDPOINT}/teams`);
      const teams = await response.json();
      setAllNames(teams);
    }
    getAllNames();
  }, []);

  const handleRegister = async (user: RegisterData): Promise<void> => {
    const password = hash_password(user.password);
    const response = await fetch(`${API_ENDPOINT}/register`, {
      body: JSON.stringify({ ...user, password }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (response.ok) {
      const user = await response.json();
      context.toggleUser(user);
      showNotification({
        message: "Successfully registered team!",
        color: "green",
      });
      window.location.replace("/");
    } else if (isConflict(response.status)) {
      showNotification({
        message: "Team name already taken",
        color: "red",
      });
    }
  };

  const validateRegister = () => {
    setTryRegister(true);
    if (validRegisterData(user)) {
      handleRegister({
        teamName: user.teamName,
        avatar: user.avatar,
        password: user.password,
      });
    }
    setTryRegister(false);
  };

  return (
    <Container size="xs">
      <Card>
        <Grid align="center" justify="space-between">
          <Grid.Col>
            <Text>Register</Text>
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Team Name"
              placeholder="Team Name"
              value={user.teamName}
              onChange={(evt) =>
                setUser({ ...user, teamName: evt.target.value })
              }
              icon={<Users />}
              radius="md"
              required={true}
              error={
                tryRegister && !user.teamName
                  ? "Required"
                  : !validTeamName(user.teamName)
                  ? "Team name must be longer than 6 characters"
                  : allNames.includes(user.teamName)
                  ? "Team name is taken"
                  : ""
              }
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Text size="md" weight="normal">
              Avatar
            </Text>
            <Grid>
              {AVATAR_NAMES.map((avatar, idx) => (
                <Grid.Col span={2}>
                  <Image
                    onClick={() => setUser({ ...user, avatar: idx })}
                    src={`/avatars/${avatar}.png`}
                    sx={(theme) => ({
                      border: user.avatar === idx ? "2px solid black" : "",
                      borderRadius: "50%",
                      ":hover": {
                        cursor: "pointer",
                      },
                    })}
                  />
                </Grid.Col>
              ))}
            </Grid>
          </Grid.Col>
          <Grid.Col span={12}>
            <PasswordStrength
              password={user.password}
              setPassword={(password: string) => setUser({ ...user, password })}
              tryRegister={tryRegister}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm Password"
              value={user.confirmPassword}
              onChange={(evt) =>
                setUser({ ...user, confirmPassword: evt.target.value })
              }
              icon={<Lock />}
              radius="md"
              required={true}
              error={
                user.confirmPassword != user.password
                  ? "Passwords do not match"
                  : ""
              }
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <Button onClick={() => validateRegister()}>Sign Up</Button>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
};

export default SignUp;
