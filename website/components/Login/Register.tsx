import { FC, useState } from "react";
import { Grid, TextInput, PasswordInput, Text, Button } from "@mantine/core";
import { FiUsers as TeamIcon, FiLock as LockIcon } from "react-icons/fi";
import PasswordStrength from "./PasswordStrength";
import { RegisterData, RegisterProps } from "../../lib/loginTypes";

const validTeamName = (teamName: string) => {
  return teamName.length > 6;
};

const validRegisterData = (data: RegisterData): boolean => {
  if (data.password !== data.confirmPassword) return false;
  if (!validTeamName(data.teamName)) return false;
  return true;
};

const emptyUser = {
  teamName: "",
  password: "",
  confirmPassword: "",
};

const Register: FC<RegisterProps> = ({ register }) => {
  const [tryRegister, setTryRegister] = useState(false);
  const [user, setUser] = useState<RegisterData>(emptyUser);

  const handleRegister = () => {
    setTryRegister(true);
    validRegisterData(user);
    setTryRegister(false);
  };

  return (
    <Grid align="center" justify="space-between">
      <Grid.Col>
        <Text>Register</Text>
      </Grid.Col>
      <Grid.Col span={12}>
        <TextInput
          label="Team Name"
          placeholder="Team Name"
          value={user.teamName}
          onChange={(evt) => setUser({ ...user, teamName: evt.target.value })}
          icon={<TeamIcon />}
          radius="md"
          required={true}
          error={
            tryRegister && !user.teamName
              ? "Required"
              : user.teamName && !validTeamName(user.teamName)
              ? "Team name must be longer than 6 characters"
              : ""
          }
        />
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
          icon={<LockIcon />}
          radius="md"
          required={true}
          error={
            user.confirmPassword != user.password
              ? "Passwords do not match"
              : ""
          }
        />
      </Grid.Col>
    </Grid>
  );
};

export default Register;
