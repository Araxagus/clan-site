export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import GameClient from "./GameClient";

export default async function GameSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  if (!params?.slug) {
    return <div className="text-white p-10">Brak sluga w URL</div>;
  }

  const game = await prisma.game.findUnique({
    where: { slug: params.slug },
    include: {
      pages: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!game) {
    return <div className="text-white p-10">Gra nie istnieje.</div>;
  }

  return <GameClient game={game as any} />;
}