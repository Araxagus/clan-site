import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        steamId: true,
        activityStart: true, // <-- teraz istnieje
      },
    });

    const results = [];

    for (const user of users) {
      let steamData = {
        steamOnline: false,
        steamGame: null,
        steamAvatar: null,
        steamName: null,
      };

      if (user.steamId) {
        try {
          const res = await fetch(
            `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${user.steamId}`,
            { cache: "no-store" }
          );

          const data = await res.json();
          const p = data.response.players?.[0];

          if (p) {
            steamData = {
              steamOnline: p.personastate === 1,
              steamGame: p.gameextrainfo || null,
              steamAvatar: p.avatarfull,
              steamName: p.personaname,
            };
          }
        } catch (e) {
          console.warn("Steam fetch failed for user", user.id);
        }
      }

      results.push({
        id: user.id,
        name: user.name,
        activityStart: user.activityStart,
        ...steamData,
      });
    }

    return NextResponse.json(results);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
