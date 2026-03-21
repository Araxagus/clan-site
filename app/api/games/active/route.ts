import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const games = await prisma.game.findMany({
    where: {
      players: {
        some: {}, // players.length > 0
      },
    },
    include: { players: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(
    games.map((g) => ({
      id: g.id,
      name: g.name,
      image: g.image,
      playerCount: g.players.length,
    }))
  );
}
