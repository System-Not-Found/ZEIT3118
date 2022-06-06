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
import { useState, useEffect } from "react";
import { Users, Lock } from "tabler-icons-react";
import { API_ENDPOINT, AVATAR_NAMES } from "../../../lib/constants";
import {
  error,
  sha256,
  isConflict,
  success,
  logNetworkCall,
} from "../../../lib/utils";
import { useSession } from "../../../lib/hooks";
import { Team } from "@prisma/client";
import { useRouter } from "next/router";
import { User } from "../../../lib/types";

interface UpdateData extends Omit<Team, "id" | "wins"> {
  password: string;
}

const validTeamName = (teamName: string): boolean => {
  return teamName.length > 6;
};

const validUpdateData = (data: UpdateData): boolean => {
  if (!validTeamName(data.name)) return false;
  return true;
};

interface UserSettingsProps {
  user: User;
}

const UserSettings: NextPage<UserSettingsProps> = ({ user }) => {
  const [tryRegister, setTryRegister] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<UpdateData>({
    ...user,
    password: "",
  });
  const [allNames, setAllNames] = useState<string[]>([]);

  const router = useRouter();
  const refresh = () => router.reload();

  useEffect(() => {
    async function getAllNames(): Promise<void> {
      const response = await fetch(`${API_ENDPOINT}/teams`);
      const teams = await response.json();
      setAllNames(teams);
    }
    getAllNames();
  }, []);

  const handleUpdate = async (user: UpdateData): Promise<void> => {
    let password = "";
    if (user.password) {
      password = sha256(user.password);
    }
    fetch(`${API_ENDPOINT}/teams`, {
      body: JSON.stringify({ ...user, password }),
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    })
      .then(logNetworkCall("Failed to update user info"))
      .then((response) => {
        if (response.ok) {
          refresh();
        }
      });
  };

  const validateUpdate = () => {
    setTryRegister(true);
    if (validUpdateData(updatedUser)) {
      handleUpdate(updatedUser);
    }
    setTryRegister(false);
  };

  return (
    <Container size="sm">
      <Card shadow="lg" p="xl">
        <Grid align="center" justify="space-between">
          <Grid.Col>
            <Text>Change Details</Text>
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Update Team Name"
              placeholder="Team Name"
              value={updatedUser.name}
              onChange={(evt) =>
                setUpdatedUser({ ...updatedUser, name: evt.target.value })
              }
              icon={<Users />}
              radius="md"
              required={true}
              error={
                tryRegister && !validTeamName(updatedUser.name)
                  ? "Team name must be longer than 6 characters"
                  : allNames
                      .filter((name) => name !== user.name)
                      .includes(updatedUser.name)
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
                    onClick={() =>
                      setUpdatedUser({ ...updatedUser, avatar: idx })
                    }
                    src={`/avatars/${avatar}.png`}
                    sx={{
                      border:
                        updatedUser.avatar === idx ? "2px solid black" : "",
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
            <PasswordInput
              label="Update Password"
              placeholder="Update Password"
              value={updatedUser.password}
              onChange={(evt) =>
                setUpdatedUser({ ...updatedUser, password: evt.target.value })
              }
              icon={<Lock />}
              radius="md"
              required={true}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Button onClick={() => validateUpdate()}>Update Info</Button>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
};

export default UserSettings;
