import { prisma } from "@/lib/prisma";

export async function getStreams() {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { twitchUrl: { not: null } },
        { youtubeUrl: { not: null } },
        { kickUrl: { not: null } },
      ],
    },
    select: {
      id: true,
      name: true,
      twitchUrl: true,
      youtubeUrl: true,
      kickUrl: true,
      isLive: true,
      livePlatform: true,
    },
  });

  const streams = users
    .map((u) => {
      const platform =
        u.livePlatform ||
        (u.twitchUrl
          ? "twitch"
          : u.youtubeUrl
          ? "youtube"
          : u.kickUrl
          ? "kick"
          : null);

      const url =
        platform === "twitch"
          ? u.twitchUrl
          : platform === "youtube"
          ? u.youtubeUrl
          : u.kickUrl;

      return {
        id: u.id,
        name: u.name,
        platform,
        url,
        isLive: u.isLive,
      };
    })
    .filter((s) => s.platform && s.url);

  // LIVE na górze
  return [
    ...streams.filter((s) => s.isLive),
    ...streams.filter((s) => !s.isLive),
  ];
}