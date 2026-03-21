import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/* ================= XML PARSER ================= */
function extract(tag: string, xml: string) {
  const match = xml.match(new RegExp(`<${tag}>(.*?)</${tag}>`));
  if (!match) return null;

  return match[1]
    .replace("<![CDATA[", "")
    .replace("]]>", "")
    .trim();
}

/* ================= MAIN ================= */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user?.steamId) {
    return NextResponse.json({ error: "No Steam linked" }, { status: 400 });
  }

  try {
    /* ============================= */
    /* 🔥 1. TRY STEAM API */
    /* ============================= */
    if (process.env.STEAM_API_KEY) {
      const apiUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${user.steamId}`;

      const res = await fetch(apiUrl, { cache: "no-store" });

      if (res.ok) {
        const data = await res.json();
        const profile = data.response.players?.[0];

        if (profile) {
          return NextResponse.json({
            steamName: profile.personaname,
            steamAvatar: profile.avatarfull,
            steamProfile: profile.profileurl,
            steamGame: profile.gameextrainfo || null,
            steamOnline: profile.personastate !== 0,
            source: "api",
          });
        }
      }
    }

    /* ============================= */
    /* 🟡 2. FALLBACK XML */
    /* ============================= */
    const xmlRes = await fetch(
      `https://steamcommunity.com/profiles/${user.steamId}?xml=1`,
      { cache: "no-store" }
    );

    const xml = await xmlRes.text();

    if (!xml || xml.includes("<!DOCTYPE")) {
      return NextResponse.json(
        { error: "Steam profile private or invalid" },
        { status: 400 }
      );
    }

    const state = extract("onlineState", xml);

    return NextResponse.json({
      steamName: extract("steamID", xml),
      steamAvatar: extract("avatarFull", xml),
      steamProfile: extract("profileurl", xml),
      steamGame: null,
      steamOnline: state === "online" || state === "in-game",
      source: "xml",
    });

  } catch (err) {
    return NextResponse.json(
      { error: "Steam fetch failed" },
      { status: 500 }
    );
  }
}