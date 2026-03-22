import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const quinfall = await prisma.game.findFirst({
      where: { name: "Quinfall" },
    });

    if (!quinfall) {
      return NextResponse.json([]);
    }

    const users = await prisma.user.findMany({
      where: {
        games: {
          some: {
            id: quinfall.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        image: true, // Discord fallback
        steamId: true,
      },
    });

    // 🧠 1. zbierz steamId
    const steamIds = users
      .map((u) => u.steamId)
      .filter(Boolean)
      .join(",");

    let steamMap: Record<string, string> = {};

    // 🧠 2. batch request do Steam API
    if (steamIds.length > 0) {
      try {
        const res = await fetch(
          `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${steamIds}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        // 🧠 3. mapowanie steamId → avatar
        for (const player of data.response.players) {
          steamMap[player.steamid] = player.avatarfull;
        }
      } catch (e) {
        console.error("Steam API batch error");
      }
    }

    // 🧠 4. budowa finalnej listy
    const players = users.map((u) => ({
      id: u.id,
      name: u.name,
      avatar:
        (u.steamId && steamMap[u.steamId]) ||
        u.image ||
        "/images/default-avatar.png",
    }));

    return NextResponse.json(players);
  } catch (err) {
    console.error("Błąd API /quinfall/players:", err);
    return NextResponse.json([], { status: 500 });
  }
}