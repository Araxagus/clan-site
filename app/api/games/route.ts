import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const games = await prisma.game.findMany({
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

export async function POST(req: Request) {
  try {
    const { name, image } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Missing name" }, { status: 400 });
    }

    const game = await prisma.game.create({
      data: {
        name,
        image, // może być null, bo w modelu jest image?
      },
    });

    return NextResponse.json(game);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
