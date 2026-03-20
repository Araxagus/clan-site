import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Homepage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Brak dostępu. Zaloguj się.</p>
      </div>
    );
  }

  // 🔥 Pobieramy usera realtime z Prisma
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Nie znaleziono użytkownika.</p>
      </div>
    );
  }

  // ⛔ konto niezatwierdzone
  if (!user.isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">
            Konto oczekuje na akceptację
          </h1>

          <p className="text-gray-400 mb-6">
            Twoje konto zostało utworzone, ale musi zostać zatwierdzone przez administratora klanu.
          </p>

          <p className="text-sm text-gray-500">
            Spróbuj ponownie później.
          </p>
        </div>
      </div>
    );
  }

  // 🔥 dostęp przyznany + realtime user
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-10">

      <header className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold">Hunters Clan Dashboard</h1>

        <Link
          href="/api/auth/signout"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
        >
          Wyloguj
        </Link>
      </header>

      <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-6 max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">
          Witaj, {user.name}
        </h2>

        <p className="text-gray-400">Rola: {user.role}</p>
        <p className="text-gray-400">Status: {user.isApproved ? "Zatwierdzony" : "Oczekujący"}</p>

        <p className="text-gray-400 mt-2">Twitch: {user.twitchUrl || "—"}</p>
        <p className="text-gray-400">YouTube: {user.youtubeUrl || "—"}</p>
        <p className="text-gray-400">Kick: {user.kickUrl || "—"}</p>
      </div>

    </div>
  );
}
