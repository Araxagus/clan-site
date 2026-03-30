import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const bosses = await prisma.boss.findMany({
    orderBy: { order: "asc" },
    include: {
      schedules: true, // 👈 KLUCZOWE - bez tego masz "brak danych"
    },
  })

  return NextResponse.json(bosses)
}