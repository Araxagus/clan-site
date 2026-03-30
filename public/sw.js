self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {}

  event.waitUntil(
    self.registration.showNotification(data.title || "Boss Alert", {
      body: data.body,
      icon: "/icon.png",
    })
  )
})