import { prisma } from "@/lib/prisma";

export async function getActiveGames() {
  const games = await prisma.game.findMany({
    where: {
      players: {
        some: {},
      },
    },
    include: {
      players: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return games.map((g) => ({
    id: g.id,
    name: g.name,
    image: g.image,
    playerCount: g.players.length,
  }));
}