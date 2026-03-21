import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/`
    );
  }

  const url = new URL(req.url);
  const claimedId = url.searchParams.get("openid.claimed_id");

  if (!claimedId) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/site/settings`
    );
  }

  // SteamID64
  const steamId = claimedId.replace("https://steamcommunity.com/openid/id/", "");

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      steamId,
      steamProfile: `https://steamcommunity.com/profiles/${steamId}`,
    },
  });

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/site/settings`
  );
}
