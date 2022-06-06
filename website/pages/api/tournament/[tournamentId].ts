import { NextApiRequest, NextApiResponse } from "next";
import prisma, {
  checkAdminPrivileges,
  getTeamIdFromCookies,
} from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tournamentId = Number.parseInt(req.query["tournamentId"] as string);
  if (req.method === "GET") await handleGet(req, res, tournamentId);
  else if (req.method === "POST") await handlePost(req, res, tournamentId);
  else if (req.method === "DELETE") await handleDelete(req, res, tournamentId);
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse,
  tournamentId: number
): Promise<void> {
  const result = await prisma.tournament.findUnique({
    where: {
      id: tournamentId,
    },
    select: {
      id: true,
      name: true,
      endTime: true,
    },
  });

  res.status(200).json(result);
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse,
  tournamentId: number
): Promise<void> {
  if (!checkAdminPrivileges(req.cookies)) {
    res
      .status(401)
      .json({ msg: "Require admin privileges to create tournament" });
    return;
  }
  const { name, endTime } = req.body;
  await prisma.tournament.create({
    data: {
      name,
      endTime,
    },
  });

  res.status(200).json({ msg: "Successfully created tournament" });
}

async function handleDelete(
  req: NextApiRequest,
  res: NextApiResponse,
  tournamentId: number
): Promise<void> {
  if (!checkAdminPrivileges(req.cookies)) {
    res
      .status(401)
      .json({ msg: "Require admin privileges to delete tournament" });
    return;
  }
  await prisma.tournament.delete({
    where: {
      id: tournamentId,
    },
  });

  res.status(200).json({ msg: "Successfully delete tournament" });
}
