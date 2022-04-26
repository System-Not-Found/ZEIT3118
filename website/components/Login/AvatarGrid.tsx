import { Grid, Card } from "@mantine/core";

const AvatarGrid = () => {
  const avatars: string[] = [];
  return (
    <Grid>
      {avatars.map((avatar, idx) => (
        <Grid.Col key={idx}>
          <img src={avatar} />
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default AvatarGrid;
