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
            steamId: true,
            activityStart: true,
          },
        });

        const formatted = [];

        for (const user of users) {
          let steamData = {
            steamOnline: false,
            steamGame: null,
            steamAvatar: null,
            steamName: null,
          };

          if (user.steamId) {
            try {
              const res = await fetch(
                `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${user.steamId}`,
                { cache: "no-store" }
              );

              const data = await res.json();
              const p = data.response.players?.[0];

              if (p) {
                steamData = {
                  steamOnline: p.personastate === 1,
                  steamGame: p.gameextrainfo || null,
                  steamAvatar: p.avatarfull,
                  steamName: p.personaname,
                };
              }
            } catch (e) {
              console.warn("Steam fetch failed for user", user.id);
            }
          }

          formatted.push({
            id: user.id,
            name: user.name,
            activityStart: user.activityStart,
            ...steamData,
          });
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(formatted)}\n\n`)
        );
      };

      // pierwsze wysłanie
      await send();

      // polling co 5s
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
