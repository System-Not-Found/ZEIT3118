import { NextApiRequest, NextApiResponse } from "next";
import prisma, { getTeamIdFromCookies } from "../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return handleGet(req, res);
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse> {
  const teamId = await getTeamIdFromCookies(req.cookies);
  if (!teamId) {
    res.status(204).json({ msg: "Must be logged in to log out" });
    return res;
  }

  await prisma.cookie.delete({
    where: {
      teamId,
    },
  });

  // Delete cookie on client
  res.setHeader(
    "Set-Cookie",
    "team_login=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  );
  res.status(200).json({ msg: "Successfully logged out" });
  return res;
}
