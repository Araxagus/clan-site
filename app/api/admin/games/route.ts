import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET → lista gier
export async function GET() {
  const games = await prisma.game.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(games);
}

// POST → dodanie nowej gry
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, image } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug" },
        { status: 400 }
      );
    }

    const game = await prisma.game.create({
      data: {
        name,
        slug,
        image: image || null,
      },
    });

    return NextResponse.json(game, { status: 201 });
  } catch (err) {
    console.error("POST /admin/games error:", err);
    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    );
  }
}
