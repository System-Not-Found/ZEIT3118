import { NextApiRequest, NextApiResponse } from "next";
import prisma, { getTeamIdFromCookies } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tournamentId = Number.parseInt(req.query["tournamentId"] as string);
  if (req.method === "GET") await handleGet(req, res, tournamentId);
  else if (req.method === "POST") await handlePost(req, res, tournamentId);
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse,
  tournamentId: number
): Promise<void> {
  const teamId = await getTeamIdFromCookies(req.cookies);
  if (!teamId) {
    res.status(202).json({ msg: "Log in to get hints" });
    return;
  }

  const results = await prisma.tournamentTeam.findMany({
    where: {
      teamId,
      tournamentId,
    },
    select: {
      completedHint: {
        select: {
          hint: {
            select: {
              value: true,
              task: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!results.length) {
    res.status(200).json([]);
    return;
  }
  const hints = results.map((result) =>
    result.completedHint.map(({ hint }) => ({
      id: hint.task[0].id,
      hint: hint.value,
    }))
  )[0];
  res.status(200).json(hints);
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse,
  tournamentId: number
): Promise<void> {
  const teamId = await getTeamIdFromCookies(req.cookies);
  if (!teamId) {
    res.status(202).json({ msg: "Log in to get hints" });
    return;
  }
  const { taskId } = req.body;

  const hint = await prisma.task.findFirst({
    where: {
      id: taskId,
    },
    select: {
      hintId: true,
      hint: {
        select: {
          value: true,
        },
      },
    },
  });

  const { id } =
    (await prisma.tournamentTeam.findFirst({
      where: {
        tournamentId,
        teamId,
      },
      select: {
        id: true,
      },
    })) || {};
  await prisma.completedHint.create({
    data: {
      hint: {
        connect: { id: hint?.hintId },
      },
      tournamentTeam: {
        connect: { id },
      },
    },
  });

  res.status(200).json({ hint: hint?.hint?.value || "" });
}
