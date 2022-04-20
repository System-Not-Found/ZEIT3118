import { FC, useState } from 'react';
import { Grid, TextInput, PasswordInput, Text, Button } from '@mantine/core';
import { FiMail as EmailIcon, FiUsers as TeamIcon, FiLock as LockIcon } from 'react-icons/fi';
import { LoginFormProps, UserProps } from './SettingsDrawer';
import PasswordStrength from './PasswordStrength';

const validEmail = (email: string): boolean => {
  return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  .test(email);
}

const validTeamName = (teamName: string) => {
  return teamName.length > 6;
}

const Register: FC<LoginFormProps> = ({
  swap,
  register
}) => {
  const [user, setUser] = useState<UserProps>({ email: "", teamName: "", password: "", confirmPassword: "" });
  const [tryRegister, setTryRegister] = useState(false);

  const handleRegister = () => {
    setTryRegister(true);
    if (user.password !== user.confirmPassword) return;
    if (!validEmail(user.email)) return;
    if (!validTeamName(user.teamName)) return;
    setTryRegister(false);
    register(user);
  }

  return (
    <Grid align="center" justify="space-between">
      <Grid.Col><Text>Register</Text></Grid.Col>
      <Grid.Col span={12}>
        <TextInput 
          label="Email" 
          placeholder="Email" 
          value={user.email} 
          onChange={(evt) => setUser({...user, email: evt.target.value})} 
          icon={<EmailIcon/>}
          radius="md"
          required={true}
          error={tryRegister && !user.email ? "Required" : user.email && !validEmail(user.email) ? "Invalid Email" : ""}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <TextInput 
          label="Team Name" 
          placeholder="Team Name" 
          value={user.teamName} 
          onChange={(evt) => setUser({...user, teamName: evt.target.value})} 
          icon={<TeamIcon/>}
          radius="md"
          required={true}
          error={tryRegister && !user.teamName ? "Required" : user.teamName && !validTeamName(user.teamName) ? "Team name must be longer than 6 characters" : ""}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <PasswordStrength 
          password={user.password} 
          setPassword={(password: string) => setUser({...user, password})}
          tryRegister={tryRegister}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <PasswordInput
          label="Confirm Password" 
          placeholder="Confirm Password" 
          value={user.confirmPassword} 
          onChange={(evt) => setUser({...user, confirmPassword: evt.target.value})} 
          icon={<LockIcon/>}
          radius="md"
          required={true}
          error={user.confirmPassword != user.password ? "Passwords do not match" : ""}
        />
      </Grid.Col>
      <Grid.Col span={9}>
        <Text 
          size="sm"
          onClick={() => swap()}
          sx={(theme) => ({ 
            '&:hover': {
              cursor: 'pointer',
              textDecoration: 'underline',
            }
          })}
        >
          Have an Account? Login
        </Text>
      </Grid.Col>
      <Grid.Col span={3}>
        <Button onClick={() => handleRegister()}>Register</Button>
      </Grid.Col>
    </Grid>
  )
}

export default Register;