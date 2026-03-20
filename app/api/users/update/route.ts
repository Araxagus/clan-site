import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const updated = await prisma.user.update({
    where: { id: body.userId },
    data: {
      twitchUrl: body.twitchUrl,
      youtubeUrl: body.youtubeUrl,
      kickUrl: body.kickUrl,
    },
  });

  return NextResponse.json({ ok: true, user: updated });
}
