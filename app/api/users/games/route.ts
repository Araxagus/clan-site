import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, games } = await req.json();

  await prisma.game.deleteMany({ where: { userId } });

  await prisma.game.createMany({
    data: games.map((g: string) => ({
      name: g,
      userId,
    })),
  });

  const updatedGames = await prisma.game.findMany({
    where: { userId },
  });

  return NextResponse.json({ ok: true, games: updatedGames });
}
