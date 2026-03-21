import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { games } = await req.json();

  await prisma.game.deleteMany();

  await prisma.game.createMany({
    data: games.map((g: string) => ({
      name: g,
    })),
  });

  const updatedGames = await prisma.game.findMany();

  return NextResponse.json({ ok: true, games: updatedGames });
}