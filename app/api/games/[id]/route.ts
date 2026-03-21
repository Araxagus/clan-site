import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET — pobranie jednej gry
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

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
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

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
  } catch (err) {
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
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
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
