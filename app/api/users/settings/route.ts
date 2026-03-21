import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      games: true, // 🔥 kluczowe — bez tego games = undefined
    },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      twitchUrl: body.twitchUrl,
      youtubeUrl: body.youtubeUrl,
      kickUrl: body.kickUrl,

      // 🔥 Steam NIE jest aktualizowany ręcznie — tylko przez Steam login
      // steamId: body.steamId,
      // steamProfile: body.steamProfile,

      games: {
        set: Array.isArray(body.games)
          ? body.games.map((id: string) => ({ id }))
          : [],
      },
    },
    include: {
      games: true,
    },
  });

  return NextResponse.json(updated);
}
