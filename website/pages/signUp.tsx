import { NextPage } from "next";

const SignUp: NextPage = () => {
  return (
    <Container size="xs">
      <Card>
        <Register />
        <Grid align="center" justify="space-between">
          <Grid.Col span={10}>
            <Text
              size="sm"
              onClick={() => setRegister(!register)}
              sx={(theme) => ({
                "&:hover": {
                  cursor: "pointer",
                  textDecoration: "underline",
                },
              })}
            >
              {register
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Text>
          </Grid.Col>
          <Grid.Col span={2}>
            <Button onClick={() => handleAuthentication(register)}>
              {register ? "Register" : "Login"}
            </Button>
          </Grid.Col>
        </Grid>
      </Card>
    </Container>
  );
};
