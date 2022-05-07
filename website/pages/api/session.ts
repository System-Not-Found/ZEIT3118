import { NextApiRequest, NextApiResponse } from "next";
import prisma, { getTeamIdFromCookies } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") await handleGet(req, res);
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const teamId = await getTeamIdFromCookies(req.cookies);
  if (!teamId) {
    res.status(202).end();
    return;
  }

  const result = await prisma.team.findUnique({
    where: {
      id: teamId,
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
  if (!result) {
    res.status(202).end();
    return;
  }
  res.status(200).json({
    id: result.id,
    name: result.name,
    avatar: result.avatar,
    wins: result.wins,
    admin: result.auth?.admin,
  });
}
