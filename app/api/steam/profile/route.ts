import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user");

  if (!userId) {
    return NextResponse.json({ error: "Missing user" });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user?.steamId) {
    return NextResponse.json({ error: "User has no Steam linked" });
  }

  const res = await fetch(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${user.steamId}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const player = data.response.players?.[0];

  if (!player) {
    return NextResponse.json({ error: "Steam profile not found" });
  }

  return NextResponse.json({
    steamAvatar: player.avatarfull,
    steamName: player.personaname,
    steamGame: player.gameextrainfo || null,
    steamOnline: player.personastate === 1,
    steamProfile: player.profileurl,
  });
}
