// app/api/admin/games/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

// GET /api/admin/games/[id]
export async function GET(_req: Request, { params }: Params) {
  const { id } = params;

  const game = await prisma.game.findUnique({
    where: { id },
    include: {
      pages: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  return NextResponse.json(game);
}

// PUT /api/admin/games/[id]
export async function PUT(req: Request, { params }: Params) {
  const { id } = params;

  try {
    const body = await req.json();
    const { name, slug, image } = body;

    const game = await prisma.game.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        image: image ?? undefined,
      },
    });

    return NextResponse.json(game);
  } catch (err) {
    console.error("PUT /admin/games/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update game" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/games/[id]
export async function DELETE(_req: Request, { params }: Params) {
  const { id } = params;

  try {
    await prisma.game.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /admin/games/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete game" },
      { status: 500 }
    );
  }
}
