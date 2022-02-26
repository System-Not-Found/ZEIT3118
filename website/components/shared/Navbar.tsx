import { Container } from "@mantine/core";

const Navbar = () => {
  return (
    <Container size="xl" padding="xs" sx={(theme) => ({ backgroundColor: theme.colors.blue[6] })}>
      Scoreboard
    </Container>
  )
}

export default Navbar;