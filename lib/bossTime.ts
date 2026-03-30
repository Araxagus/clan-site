export function nextDaily(hour: number, minute = 0) {
  const now = new Date()

  const next = new Date()
  next.setHours(hour, minute, 0, 0)

  if (next <= now) {
    next.setDate(next.getDate() + 1)
  }

  return next
}