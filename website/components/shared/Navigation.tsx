import { Avatar, Container, Text, Menu } from "@mantine/core";
import Link from "next/link";
import { NextLink } from "@mantine/next";
import { FC } from "react";
import { Settings, Logout } from "tabler-icons-react";

interface NavigationProps {
  avatar: number;
}

const Navigation: FC<NavigationProps> = ({ avatar }) => {
  const handleLogout = () => {};
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
      <Menu
        trigger="hover"
        control={
          <Avatar
            src={avatar === -1 ? null : `/avatars/${avatar}.png`}
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
    </Container>
  );
};

export default Navigation;
