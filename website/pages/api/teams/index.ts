import { NextApiRequest, NextApiResponse } from "next";
import prisma, {
  checkAdminPrivileges,
  getTeamIdFromCookies,
} from "../../../lib/prisma";
import { saltPassword } from "../../../lib/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") await handleGet(req, res);
  else if (req.method === "DELETE") await handleDelete(req, res);
  else if (req.method === "PATCH") await handlePatch(req, res);
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

async function handlePatch(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const teamId = await getTeamIdFromCookies(req.cookies);
  const { name, avatar, password } = req.body;
  if (password) {
    const { salt } = (await prisma.auth.findFirst({
      where: {
        teamId,
      },
      select: {
        salt: true,
      },
    })) ?? { salt: "" };
    if (!salt) {
      res.status(500).json({ msg: "Team update failed" });
      return;
    }
    const saltedPassword = saltPassword(salt, password);
    await prisma.auth.update({
      where: {
        teamId,
      },
      data: {
        password: saltedPassword,
      },
    });
  }
  await prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      name,
      avatar,
    },
  });
  res.status(200).json({ msg: "Successfully updated team" });
}
