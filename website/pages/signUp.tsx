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
import PasswordStrength from "../components/login/PasswordStrength";
import { Users, Lock } from "tabler-icons-react";
import { API_ENDPOINT, AVATAR_NAMES } from "../lib/constants";
import { error, sha256, isConflict, success } from "../lib/utils";
import Link from "next/link";

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
  if (data.password === "") return false;
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
    const password = sha256(user.password);
    const response = await fetch(`${API_ENDPOINT}/register`, {
      body: JSON.stringify({ ...user, password }),
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    if (response.ok) {
      success("Successfully added team!");
      window.location.replace("/");
    } else if (isConflict(response.status)) {
      error("Team name already taken");
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
    <Container size="sm">
      <Card shadow="lg" p="xl">
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
                  : user.teamName && !validTeamName(user.teamName)
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
                <Grid.Col span={2} key={idx}>
                  <Image
                    alt={`Avatar image: ${avatar}`}
                    onClick={() => setUser({ ...user, avatar: idx })}
                    src={`/avatars/${avatar}.png`}
                    sx={{
                      border: user.avatar === idx ? "2px solid black" : "",
                      borderRadius: "50%",
                      width: "75px",
                      height: "75px",
                      ":hover": {
                        cursor: "pointer",
                      },
                      "@media (max-width: 600px)": {
                        width: "40px",
                        height: "40px",
                      },
                    }}
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
          <Grid.Col span={6}>
            <Button onClick={() => validateRegister()}>Sign Up</Button>
          </Grid.Col>
          <Grid.Col span={6}>
            <Link href="/login" passHref={true}>
              <Text
                size="sm"
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    textDecoration: "underline",
                  },
                }}
              >
                Already have an account? Log in
              </Text>
            </Link>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
};

export default SignUp;
