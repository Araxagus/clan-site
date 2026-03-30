import { inngest } from "@/lib/inngest"
import { prisma } from "@/lib/prisma"

export const spawnBoss = inngest.createFunction(
  { id: "spawn-boss" },
  async ({ event }: { event: any }) => {
    const { bossId } = event.data

    const boss = await prisma.boss.findUnique({
      where: { id: bossId },
    })

    if (!boss) return { ok: false, error: "Boss not found" }

    await prisma.boss.update({
      where: { id: bossId },
      data: {
        lastSpawnAt: new Date(),
      },
    })

    console.log("🔥 Boss spawned:", boss.name)

    return { ok: true }
  }
)