import { NextApiRequest, NextApiResponse } from "next";
import prisma, { checkAdminPrivileges } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") await handleGet(req, res);
  if (req.method === "POST") await handlePost(req, res);
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const results = await prisma.tournament.findMany();
  res.status(200).json(results);
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (!checkAdminPrivileges(req.cookies)) {
    res
      .status(401)
      .json({ msg: "Require admin privileges to create tournament" });
    return;
  }
  const { name, endTime } = req.body;
  const exists = await prisma.tournament.count({ where: { name } });
  if (exists) {
    res.status(409).json({ msg: "Tournament name must be unique" });
    return;
  }
  await prisma.tournament.create({
    data: {
      name,
      endTime,
    },
  });
  res.status(200).json({ msg: "Successfully created tournamnet" });
}
