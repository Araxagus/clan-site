import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import build from "next/dist/build";

export async function GET() {
  const games = await prisma.game.findMany({
    include: { players: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(
    games.map((g) => ({
      id: g.id,
      name: g.name,
      slug: g.slug,
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

    // AUTO-GENEROWANIE SLUGA
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const game = await prisma.game.create({
      data: {
        name,
        slug,
        image: image ?? null,
      },
    });

    return NextResponse.json(game);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}