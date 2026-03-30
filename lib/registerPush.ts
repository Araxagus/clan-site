export async function registerPush() {
  if (!("serviceWorker" in navigator)) return

  const reg = await navigator.serviceWorker.register("/sw.js")

  const permission = await Notification.requestPermission()
  if (permission !== "granted") return

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
    ),
  })

  await fetch("/api/push/subscribe", {
    method: "POST",
    body: JSON.stringify(sub),
  })
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/")

  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}