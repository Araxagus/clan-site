import Settings from "./Settings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-xl opacity-80">Brak dostępu. Zaloguj się.</p>
      </div>
    );
  }

  // 🔥 Pobieramy usera BEZPOŚREDNIO z bazy
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { games: true },
  });

  // 🔥 Pobieramy gry BEZ fetch
  const games = await prisma.game.findMany();

  return <Settings initialUser={user} initialGames={games} />;
}
