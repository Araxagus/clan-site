import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import HomepageClient from "@/app/site/homepage/HomepageClient";

export default async function Homepage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-xl opacity-80">Brak dostępu. Zaloguj się.</p>
      </div>
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const games = await fetch(`${baseUrl}/api/games/active`, {
    cache: "no-store",
  }).then((r) => r.json());

  const streams = await fetch(`${baseUrl}/api/streams/clan`, {
    cache: "no-store",
  }).then((r) => r.json());

  return (
    <HomepageClient
      session={session}
      games={games}
      streams={streams}
    />
  );
}
