export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import GameClient from "./GameClient";

export default async function GameSlugPage(props: any) {
  // 🔍 DEBUG: całe props
  console.log("PAGE PROPS:", JSON.stringify(props, null, 2));

  const params = props?.params;

  console.log("PARAMS:", params);
  console.log("SLUG:", params?.slug);

  if (!params?.slug) {
    return <div className="text-white p-10">Brak sluga w URL</div>;
  }

  let game;

  try {
    game = await prisma.game.findUnique({
      where: { slug: params.slug },
      include: {
        pages: {
          orderBy: { order: "asc" },
        },
      },
    });

    console.log("GAME FOUND:", game?.id);
  } catch (err) {
    console.error("PRISMA ERROR:", err);
    return <div className="text-white p-10">Błąd bazy danych</div>;
  }

  if (!game) {
    console.log("GAME NOT FOUND for slug:", params.slug);
    return <div className="text-white p-10">Gra nie istnieje.</div>;
  }

  return <GameClient game={game as any} />;
}