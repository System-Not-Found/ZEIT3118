import { FC, useState } from 'react';
import { Grid, TextInput, PasswordInput, Text, Button } from '@mantine/core';
import { FiUsers as TeamIcon, FiLock as LockIcon } from 'react-icons/fi';
import { LoginFormProps, UserProps } from './SettingsDrawer';

const Login: FC<LoginFormProps> = ({
  swap,
  register,
}) => {
  const [user, setUser] = useState<UserProps>({ email: "", teamName: "", password: "", confirmPassword: "" });
  return (
    <Grid align="center" justify="space-between">
      <Grid.Col><Text>Login</Text></Grid.Col>
      <Grid.Col span={12}>
        <TextInput 
          label="Team Name" 
          placeholder="Team Name" 
          value={user.teamName} 
          onChange={(evt) => setUser({...user, teamName: evt.target.value})} 
          icon={<TeamIcon/>}
          radius="md"
          required={true}
        />
      </Grid.Col>
      <Grid.Col span={12}>
        <PasswordInput
          label="Password" 
          placeholder="Password" 
          value={user.password} 
          onChange={(evt) => setUser({...user, password: evt.target.value})} 
          icon={<LockIcon/>}
          radius="md"
          required={true}
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
          Don't have an account? Register
        </Text>
      </Grid.Col>
      <Grid.Col span={3}>
        <Button onClick={() => register(user)}>Login</Button>
      </Grid.Col>
    </Grid>
  )
}

export default Login;