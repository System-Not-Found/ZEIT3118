import { Avatar, Container, Text, Menu, Button } from "@mantine/core";
import Link from "next/link";
import { NextLink } from "@mantine/next";
import { FC } from "react";
import { Settings, Logout } from "tabler-icons-react";
import { API_ENDPOINT, AVATAR_NAMES } from "../../lib/constants";
import { error, getAvatarSrc, success } from "../../lib/utils";

interface NavigationProps {
  id: number;
  avatar: number;
}

const Navigation: FC<NavigationProps> = ({ id, avatar }) => {
  const handleLogout = async () => {
    const response = await fetch(`${API_ENDPOINT}/logout`, {
      credentials: "include",
    });
    if (response.ok) {
      success("Successfully logged out");
      window.location.replace("/login");
    } else {
      error("Unable to log out");
    }
  };

  const loggedIn = id !== -1;

  return (
    <Container
      p="md"
      size="xl"
      sx={(theme) => ({
        borderBottom: `2px solid ${theme.colors.gray[2]}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      })}
    >
      <Link href="/">
        <Text size="xl" sx={{ ":hover": { cursor: "pointer" } }}>
          Cyber Modules
        </Text>
      </Link>
      {loggedIn ? (
        <Menu
          trigger="hover"
          control={
            <Avatar
              src={getAvatarSrc(avatar)}
              radius="lg"
              size="lg"
              sx={{ ":hover": { cursor: "pointer" } }}
            />
          }
        >
          <Menu.Item component={NextLink} href="/settings" icon={<Settings />}>
            Settings
          </Menu.Item>
          <Menu.Item onClick={() => handleLogout()} icon={<Logout />}>
            Logout
          </Menu.Item>
        </Menu>
      ) : (
        <div>
          <Link href="/login">
            <Button sx={(theme) => ({ margin: theme.spacing.md })}>
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline">Sign Up</Button>
          </Link>
        </div>
      )}
    </Container>
  );
};

export default Navigation;
