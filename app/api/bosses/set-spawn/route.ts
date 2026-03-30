import { NextResponse, NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // 🔒 MUST BE ADMIN
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    )
  }

  const body = await req.json()

  const { bossId, nextSpawnAt } = body

  if (!bossId || !nextSpawnAt) {
    return NextResponse.json(
      { error: "Missing data" },
      { status: 400 }
    )
  }

  const updated = await prisma.boss.update({
    where: { id: bossId },
    data: {
      nextSpawnAt: new Date(nextSpawnAt),
    },
  })

  return NextResponse.json(updated)
}