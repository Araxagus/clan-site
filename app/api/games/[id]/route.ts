import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET — pobranie jednej gry
 */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const game = await prisma.game.findUnique({
    where: { id },
    include: {
      players: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      sessions: true,
    },
  });

  if (!game) {
    return NextResponse.json(
      { error: "Game not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(game);
}

/**
 * DELETE — usuwa tylko jedną grę
 */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Invalid ID" },
      { status: 400 }
    );
  }

  try {
    await prisma.game.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Game not found" },
      { status: 404 }
    );
  }
}

/**
 * PATCH — edycja gry
 */
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  const game = await prisma.game.findUnique({
    where: { id },
  });

  if (!game) {
    return NextResponse.json(
      { error: "Game not found" },
      { status: 404 }
    );
  }

  const updated = await prisma.game.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.image !== undefined && { image: body.image }),
      ...(body.active !== undefined && { active: body.active }),
    },
  });

  return NextResponse.json(updated);
}