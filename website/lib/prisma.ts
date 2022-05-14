import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;

// UTILS
type Cookies = Record<string, string>;

export async function getTeamIdFromCookies(cookies: Cookies): Promise<number> {
  const cookie = cookies["team_login"];
  const results = await prisma.cookie.findFirst({
    where: {
      cookie,
    },
    select: {
      teamId: true,
    },
  });
  return results?.teamId || 0;
}

export async function checkAdminPrivileges(cookies: Cookies): Promise<boolean> {
  const teamId = await getTeamIdFromCookies(cookies);
  if (!teamId) return false;
  const result = await prisma.auth.findUnique({
    where: {
      teamId,
    },
    select: {
      admin: true,
    },
  });
  return result?.admin || false;
}
