export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import GameClient from "./GameClient";

export default async function GameSlugPage(props: any) {
  const params = await props.params;
  const slug = params?.slug;

  if (!slug) {
    return <div className="text-white p-10">Brak sluga w URL</div>;
  }

  const game = await prisma.game.findUnique({
    where: { slug },
    include: {
      pages: { orderBy: { order: "asc" } },
    },
  });

  if (!game) {
    return <div className="text-white p-10">Gra nie istnieje.</div>;
  }

  const isAdmin = true; // podmień na realne sprawdzanie

  return <GameClient game={game as any} isAdmin={isAdmin} />;
}
