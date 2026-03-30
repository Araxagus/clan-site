const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  const bosses = [
    { name: "Titanseal", slug: "titanseal", imageUrl: null },
    { name: "Aero-Forge", slug: "aero-forge", imageUrl: null },
    { name: "Ironscale", slug: "ironscale", imageUrl: null },
    { name: "Doomcaller", slug: "doomcaller", imageUrl: null },
    { name: "Vel'khurath", slug: "velkhurath", imageUrl: null },
    { name: "Seraphiel", slug: "seraphiel", imageUrl: null },
  ]

  await prisma.boss.createMany({
    data: bosses,
    skipDuplicates: true,
  })

  const bossMap = await prisma.boss.findMany({
    select: { id: true, name: true }
  })

  const map = new Map(bossMap.map((b) => [b.name, b.id]))

  const schedule = [
    ...create(map.get("Titanseal"), 17),
    ...create(map.get("Aero-Forge"), 18),
    ...create(map.get("Ironscale"), 19),
    ...create(map.get("Doomcaller"), 22),
    ...create(map.get("Vel'khurath"), 23),
    ...create(map.get("Seraphiel"), 24),
  ]

  await prisma.bossSchedule.createMany({
    data: schedule,
  })

  console.log("SEED DONE")
}

function create(bossId, hour) {
  const channels = [1, 2, 3, 4]
  const days = [0, 1, 2, 3, 4, 5, 6]

  const out = []

  for (const dayOfWeek of days) {
    for (const channel of channels) {
      out.push({
        bossId,
        channel,
        dayOfWeek,   // ← zgodnie z modelem
        hour,
        minute: 0,
      })
    }
  }

  return out
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
