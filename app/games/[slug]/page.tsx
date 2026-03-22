export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import GameClient from "./GameClient";

export default async function GameSlugPage(props: any) {
  const { params } = props;

  console.log("RAW PARAMS:", params);

  // ✅ WAŻNE: await params
  const resolvedParams = await params;

  console.log("RESOLVED PARAMS:", resolvedParams);
  console.log("SLUG:", resolvedParams?.slug);

  if (!resolvedParams?.slug) {
    return <div className="text-white p-10">Brak sluga w URL</div>;
  }

  const game = await prisma.game.findUnique({
    where: { slug: resolvedParams.slug },
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