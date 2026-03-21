// app/api/users/stream/route.ts
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = async () => {
        const users = await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            discordId: true,
            discordStatus: true,
            discordActivity: true,
          },
        });

        const formatted = users
          .filter((u) => u.discordId)
          .map((u) => ({
            id: u.id,
            name: u.name,
            discordStatus: u.discordStatus || "offline",
            discordActivity: u.discordActivity || null,
            isOnline:
              u.discordStatus && u.discordStatus !== "offline",
          }));

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(formatted)}\n\n`)
        );
      };

      // pierwsze wysłanie
      await send();

      // polling wewnętrzny (backend → SSE)
      const interval = setInterval(send, 5000);

      // cleanup
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}