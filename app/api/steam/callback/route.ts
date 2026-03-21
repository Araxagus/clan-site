import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function getBaseUrl(req: Request) {
  const host = req.headers.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  const baseUrl = getBaseUrl(req);

  if (!session) {
    return NextResponse.redirect(`${baseUrl}/`);
  }

  const url = new URL(req.url);
  const claimedId = url.searchParams.get("openid.claimed_id");

  if (!claimedId) {
    return NextResponse.redirect(`${baseUrl}/site/settings`);
  }

  const steamId = claimedId.replace(
    "https://steamcommunity.com/openid/id/",
    ""
  );

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      steamId,
      steamProfile: `https://steamcommunity.com/profiles/${steamId}`,
    },
  });

  return NextResponse.redirect(`${baseUrl}/site/settings`);
}