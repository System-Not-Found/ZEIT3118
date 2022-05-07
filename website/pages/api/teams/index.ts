import { NextApiRequest, NextApiResponse } from "next";
import prisma, { checkAdminPrivileges } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") await handleGet(req, res);
  else if (req.method === "DELETE") await handleDelete(req, res);
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const results = await prisma.team.findMany({
    select: {
      name: true,
    },
  });
  const names = results.map((team) => team.name);
  res.status(200).json(names);
}

async function handleDelete(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (!checkAdminPrivileges(req.cookies)) {
    res.status(401).json({ msg: "Require admin privileges to delete team" });
    return;
  }
  const { teamName } = req.body;

  await prisma.team.delete({
    where: {
      name: teamName,
    },
  });

  res.status(200).json({ msg: "Successfully deleted team" });
}
