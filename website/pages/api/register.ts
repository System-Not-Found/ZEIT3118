import { NextApiRequest, NextApiResponse } from "next";
import prisma, { getTeamIdFromCookies } from "../../lib/prisma";
import { generateRandomString, saltPassword } from "../../lib/utils";
import { serialize } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") await handlePost(req, res);
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { teamName, avatar, password } = req.body;

  const existingTeam = await prisma.team.count({ where: { name: teamName } });
  if (existingTeam) {
    res.status(409).json({ msg: "Team name already taken" });
    return;
  }
  const id = await createUser(teamName, avatar, password);
  const cookie = generateRandomString();
  await prisma.cookie.create({
    data: {
      cookie,
      team: {
        connect: { id },
      },
    },
  });
  res.setHeader("Set-Cookie", `team_login=${cookie}; path=/; httpOnly=True`);
  res.status(200).json({ msg: "Successfully registered team" });
}

export async function createUser(
  teamName: string,
  avatar: number,
  password: string,
  admin = false
): Promise<number> {
  const salt = generateRandomString();
  const saltedPassword = saltPassword(salt, password);
  const team = await prisma.team.create({
    data: {
      name: teamName,
      avatar,
      auth: {
        create: {
          password: saltedPassword,
          salt,
          admin,
        },
      },
    },
  });
  return team.id;
}
