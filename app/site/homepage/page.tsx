import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import HomepageClient from "@/app/site/homepage/HomepageClient";
import { getActiveGames } from "@/lib/getActiveGames";
import { getStreams } from "@/lib/getStreams";

export default async function Homepage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-xl opacity-80">Brak dostępu. Zaloguj się.</p>
      </div>
    );
  }

  const games = await getActiveGames();
  const streams = await getStreams();

  return (
    <HomepageClient
      session={session}
      games={games}
      streams={streams}
    />
  );
}