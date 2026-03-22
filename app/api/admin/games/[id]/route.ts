import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET → pobierz grę + strony
export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ← FIX

  try {
    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        pages: { orderBy: { order: "asc" } },
      },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (err) {
    console.error("GET /admin/games/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch game" },
      { status: 500 }
    );
  }
}

// DELETE → usuń grę
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ← FIX

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
