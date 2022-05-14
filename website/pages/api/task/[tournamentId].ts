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
    res.status(202).json({ msg: "Log in to get a team's tasks" });
    return;
  }
  const result = await prisma.tournamentTeam.findFirst({
    where: {
      teamId,
      tournamentId,
    },
    select: {
      completedTask: {
        select: {
          id: true,
        },
      },
    },
  });

  const ids = result?.completedTask.map((task) => task.id) || [];
  res.status(200).json(ids);
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse,
  tournamentId: number
): Promise<void> {
  const teamId = await getTeamIdFromCookies(req.cookies);
  if (!teamId) {
    res.status(202).json({ msg: "Log in to submit tasks" });
    return;
  }
  const { password, taskId } = req.body;
  const pwdRes = await prisma.task.findFirst({
    where: {
      id: taskId,
    },
    select: {
      password: true,
    },
  });

  if (password === pwdRes?.password) {
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
    await prisma.completedTask.create({
      data: {
        task: {
          connect: {
            id: taskId,
          },
        },
        tournamentTeam: {
          connect: {
            id,
          },
        },
      },
    });
    res.status(200).json({ msg: "Successfully submitted task" });
  } else {
    res.status(401).json({ msg: "Incorrect task password provided" });
  }
}
