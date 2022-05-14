import { NextApiRequest, NextApiResponse } from "next";
import prisma, { checkAdminPrivileges } from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") await handleGet(req, res);
  else if (req.method === "POST") await handlePost(req, res);
  else if (req.method === "DELETE") await handleDelete(req, res);
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const result = await prisma.task.findMany({
    select: {
      id: true,
      name: true,
      points: true,
    },
  });
  res.status(200).json(result);
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (!checkAdminPrivileges(req.cookies)) {
    res.status(401).json({ msg: "Require admin privileges to create tasks" });
    return;
  }

  const { name, points, password, hint } = req.body;

  await prisma.task.create({
    data: {
      name: name,
      points,
      password,
      hint: {
        create: {
          value: hint,
        },
      },
    },
  });
  res.status(200).json({ msg: "Successfully created Task" });
}

async function handleDelete(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (!checkAdminPrivileges(req.cookies)) {
    res.status(401).json({ msg: "Require admin privileges to delete task" });
    return;
  }
  const { id } = req.body;
  await prisma.task.delete({
    where: {
      id,
    },
  });
  res.status(200).json({ msg: "Successfully deleted Task" });
}
