import { NextApiRequest, NextApiResponse } from "next";
import prisma, { checkAdminPrivileges } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tournamentId = Number.parseInt(req.query["tournamentId"] as string);
  if (req.method === "GET") await handleGet(req, res, tournamentId);
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse,
  tournamentId: number
): Promise<void> {
  const results = await prisma.tournamentTeam.findMany({
    where: {
      tournamentId,
    },
    select: {
      completedHint: {
        select: {
          id: true,
        },
      },
      completedTask: {
        select: {
          task: {
            select: {
              points: true,
            },
          },
        },
      },
      team: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  res.status(200).json(
    results.map((result) => ({
      ...result.team,
      points:
        result.completedTask.reduce((prev, curr) => {
          prev + curr.task.points;
          return prev;
        }, 0) -
        result.completedHint.length * 50,
    }))
  );
}
