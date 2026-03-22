import { prisma } from "@/lib/prisma";
import GameClient from "./GameClient";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function GameSlugPage({ params }: PageProps) {
  const game = await prisma.game.findUnique({
    where: { slug: params.slug },
    include: {
      pages: { orderBy: { order: "asc" } },
    },
  });

  if (!game) {
    return <div className="text-white p-10">Gra nie istnieje.</div>;
  }

  // 👇 KLUCZOWA LINIA — rzutowanie na typ klienta
  return <GameClient game={game as any} />;
}
