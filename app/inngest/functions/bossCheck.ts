import { inngest } from "@/lib/inngest"
import { prisma } from "@/lib/prisma"
import { sendPush } from "@/lib/push"

export const bossCheckFunction = inngest.createFunction(
  {
    id: "boss-check",
    triggers: [
      {
        cron: "*/1 * * * *",
      },
    ],
  },

  async ({ step }: { step: any }) => {
    const bosses = await step.run("load-bosses", async () => {
      return prisma.boss.findMany()
    })

    const subs = await step.run("load-subs", async () => {
      return prisma.pushSubscription.findMany()
    })

    for (const boss of bosses as any[]) {
      if (!boss.nextSpawnAt) continue

      const diff =
        new Date(boss.nextSpawnAt).getTime() - Date.now()

      const mins = Math.floor(diff / 60000)

      if (![15, 10, 5].includes(mins)) continue

      await step.run(`push-${boss.id}-${mins}`, async () => {
        return Promise.all(
          (subs as any[]).map((sub) =>
            sendPush(
              {
                endpoint: sub.endpoint,
                keys: {
                  p256dh: sub.p256dh,
                  auth: sub.auth,
                },
              },
              {
                title: `⚠️ Boss ${boss.name}`,
                body: `Spawn in ${mins} minutes`,
              }
            )
          )
        )
      })
    }
  }
)