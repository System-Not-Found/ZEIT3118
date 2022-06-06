import { NextApiRequest, NextApiResponse } from "next";
import prisma, { getTeamIdFromCookies } from "../../lib/prisma";
import { generateRandomString, saltPassword } from "../../lib/utils";
import { createUser } from "./register";

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
  const { teamName, password } = req.body;
  // Create an admin if it hasn't been created yet
  if (teamName === "Admin") {
    const adminCount = await prisma.team.count({ where: { name: "Admin" } });
    if (!adminCount) {
      await createUser(teamName, -1, password, true);
    }
  }

  const auth = await prisma.auth.findFirst({
    where: {
      team: {
        name: teamName,
      },
    },
    select: {
      password: true,
      salt: true,
    },
  });
  if (auth && saltPassword(auth.salt, password) === auth.password) {
    const result = await prisma.team.findUnique({
      where: {
        name: teamName,
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        wins: true,
        auth: {
          select: {
            admin: true,
          },
        },
      },
    });

    // Check for stale cookie
    const stale = await prisma.cookie.findFirst({
      where: {
        team: {
          name: teamName,
        },
      },
      select: {
        cookie: true,
      },
    });

    if (stale) {
      await prisma.cookie.delete({
        where: {
          cookie: stale.cookie,
        },
      });
    }

    // Create new cookie
    const cookie = generateRandomString();
    await prisma.cookie.create({
      data: {
        cookie,
        team: {
          connect: { id: result?.id },
        },
      },
    });
    res.setHeader("Set-Cookie", `team_login=${cookie}; path=/; httpOnly=True`);
    res.status(200).json({
      id: result?.id,
      name: result?.name,
      avatar: result?.name,
      wins: result?.wins,
      admin: result?.auth?.admin,
    });
  } else {
    res.status(401).json({ msg: "Invalid team name and password combination" });
  }
}
