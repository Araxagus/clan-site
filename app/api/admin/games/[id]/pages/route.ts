import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST → dodaj stronę do gry
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id: gameId } = await context.params; // ← FIX

  try {
    const body = await req.json();
    const { key, label, category, subcategory, order, content } = body;

    if (!key || !label || !category || !subcategory) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const page = await prisma.gamePage.create({
      data: {
        key,
        label,
        category,
        subcategory,
        order: order ?? 0,
        content: content ?? {},
        gameId,
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (err) {
    console.error("POST /admin/games/[id]/pages error:", err);
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    );
  }
}
