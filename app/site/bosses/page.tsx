"use client"

import { useEffect, useState } from "react"

type Boss = {
  id: string
  name: string
  imageUrl: string | null
  schedules: {
    channel: number
    hour: number
    minute: number
  }[]
}

export default function BossPage() {
  const [bosses, setBosses] = useState<Boss[]>([])
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    fetch("/api/bosses")
      .then((res) => res.json())
      .then((data) => setBosses(data))

    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const getNextSpawnTime = (hour: number, minute: number) => {
    const d = new Date()
    d.setHours(hour, minute, 0, 0)

    // jeśli spawn już był dzisiaj → ustaw na jutro
    if (d.getTime() <= now) {
      d.setDate(d.getDate() + 1)
    }

    return d.getTime()
  }

  const formatRemaining = (target: number) => {
    const diff = target - now
    if (diff <= 0) return "🟢 SPAWNED"

    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)

    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {bosses.map((boss) => {
        const chMap: Record<number, { time: string; target: number }> = {}

        boss.schedules?.forEach((s) => {
          const target = getNextSpawnTime(s.hour, s.minute)
          chMap[s.channel] = {
            time: `${String(s.hour).padStart(2, "0")}:${String(
              s.minute
            ).padStart(2, "0")}`,
            target,
          }
        })

        return (
          <div
            key={boss.id}
            className="rounded-2xl bg-black/70 border border-red-500/20 p-4"
          >
            <div className="w-full h-40 bg-gray-800 rounded-xl overflow-hidden mb-3">
              {boss.imageUrl && (
                <img
                  src={boss.imageUrl}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <h2 className="text-white text-xl font-bold mb-3 text-center">
              {boss.name}
            </h2>

            <div className="grid grid-cols-2 gap-2 text-sm">
              {[1, 2, 3, 4].map((ch) => {
                const data = chMap[ch]

                return (
                  <div
                    key={ch}
                    className="bg-black/40 rounded-lg px-3 py-2 flex flex-col"
                  >
                    <div className="flex justify-between">
                      <span className="text-gray-400">CH{ch}</span>
                      <span className="text-white font-mono">
                        {data?.time ?? "--:--"}
                      </span>
                    </div>

                    <div className="text-right text-green-400 font-mono text-xs">
                      {data ? formatRemaining(data.target) : ""}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
