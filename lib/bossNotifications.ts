import { prisma } from "@/lib/prisma"
import { sendPush } from "@/lib/push"

const TRIGGERS = [15, 10, 5]

export async function checkBossAlerts() {
  const bosses = await prisma.boss.findMany()
  const subs = await prisma.pushSubscription.findMany()

  for (const boss of bosses) {
    if (!boss.nextSpawnAt) continue

    const diff = new Date(boss.nextSpawnAt).getTime() - Date.now()
    const mins = Math.floor(diff / 60000)

    if (!TRIGGERS.includes(mins)) continue

    for (const sub of subs) {
      await sendPush(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        {
          title: `⚠️ Boss ${boss.name}`,
          body: `Spawn in ${mins} minutes!`,
        }
      )
    }
  }
}