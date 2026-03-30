import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const sub = await req.json()

  await prisma.pushSubscription.upsert({
    where: { endpoint: sub.endpoint },
    update: {
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
    },
    create: {
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
    },
  })

  return Response.json({ ok: true })
}