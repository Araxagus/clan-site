import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import UserPanel from "../components/UserPanel";

export default async function Homepage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-xl opacity-80">Brak dostępu. Zaloguj się.</p>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-xl opacity-80">Nie znaleziono użytkownika.</p>
      </div>
    );
  }

  if (!user.isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
        <div className="text-center max-w-md bg-gray-900/60 backdrop-blur-xl p-8 rounded-2xl border border-gray-700 shadow-xl">
          <h1 className="text-3xl font-bold mb-4">⏳ Oczekiwanie na akceptację</h1>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Twoje konto zostało utworzone, ale musi zostać zatwierdzone przez administratora klanu.
          </p>
          <p className="text-sm text-gray-500">Spróbuj ponownie później.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white flex justify-between">

      {/* LEWA STRONA */}
      <div className="flex-1 max-w-7xl mx-auto p-10">

        {/* HEADER */}
        <header className="flex items-center justify-between mb-12">

          {/* LEFT */}
          <div className="flex items-center gap-6">
            <UserPanel user={user} />

            <div>
              <h1 className="text-3xl font-extrabold tracking-wide">Hunters Clan</h1>
              <p className="text-gray-400 text-sm">Wybierz swoją grę</p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="text-sm text-gray-400">
            Witaj, <span className="text-white font-semibold">{user.name}</span>
          </div>

        </header>

        {/* GRY */}
        <div>
          <h2 className="text-2xl font-bold mb-6">🎮 Gry klanowe</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <GameCard href="/site/game/ark" title="🦖 Ark: Survival Ascended" desc="Mapy • Bossy • Timery • Crafting" color="text-blue-400" />
            <GameCard href="/site/game/conan" title="🗡️ Conan Exiles" desc="Mapy • Thrallowie • Bossy • Crafting" color="text-orange-400" />
            <GameCard href="/site/game/poe2" title="🔥 Path of Exile 2" desc="Buildy • Mapy • Crafting • Ekonomia" color="text-yellow-400" />
            <GameCard href="/site/game/quinfall" title="🌿 Quinfall" desc="Mapy • Bossy • Crafting • Timery" color="text-green-400" />
            <GameCard href="/site/game/diablo4" title="😈 Diablo 4" desc="Buildy • Bossy • Eventy" color="text-red-400" />
            <GameCard href="/site/game/minecraft" title="🟩 Minecraft" desc="Mapy • Pluginy • Serwery" color="text-green-300" />
            <GameCard href="/site/game/cs" title="🔫 Counter-Strike" desc="Taktyki • Mapy • Setupy" color="text-blue-300" />
          </div>
        </div>

        {/* STREAMY */}
        <div className="mt-20 border-t border-gray-800 pt-12">
          <h2 className="text-3xl font-bold mb-10">📺 Streamy klanowe</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <StreamCard name={user.name} game="Ark: Survival Ascended" viewers={32} thumbnail="https://placehold.co/600x340" />
            <StreamCard name="ShadowWolf" game="Conan Exiles" viewers={12} thumbnail="https://placehold.co/600x340" />
            <StreamCard name="NightRider" game="Path of Exile 2" viewers={54} thumbnail="https://placehold.co/600x340" />
          </div>
        </div>

        {/* DISCORD */}
        <div className="mt-20 border-t border-gray-800 pt-12">
          <h2 className="text-3xl font-bold mb-8">💬 Discord</h2>

          <div className="bg-gray-900/50 border border-gray-700 rounded-2xl overflow-hidden">
            <iframe
              src="https://discord.com/widget?id=YOUR_SERVER_ID&theme=dark"
              width="100%"
              height="350"
              allowTransparency={true}
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            />
          </div>
        </div>

      </div>

      {/* ONLINE SIDEBAR */}
      <aside className="hidden xl:block w-56 border-l border-gray-800 bg-black/40 backdrop-blur-xl p-4 sticky top-0 h-screen">
        <h3 className="text-sm font-semibold mb-4 text-gray-300 uppercase tracking-wide">
          🟢 Online
        </h3>

        <div className="space-y-2">
          {["HunterMaster", "ShadowWolf", "NightRider"].map((name, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-800/60 transition">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <p className="text-sm text-gray-300 truncate">{name}</p>
            </div>
          ))}
        </div>
      </aside>

    </div>
  );
}

/* GAME CARD */
function GameCard({ href, title, desc, color }: any) {
  return (
    <Link
      href={href}
      className="group bg-gray-900/50 border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:bg-gray-800/60 transition-all"
    >
      <h3 className={`text-xl font-semibold mb-2 ${color} group-hover:opacity-80 transition`}>
        {title}
      </h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </Link>
  );
}

/* STREAM CARD */
function StreamCard({ name, game, viewers, thumbnail }: any) {
  return (
    <div className="group cursor-pointer">
      <div className="relative rounded-xl overflow-hidden">
        <img src={thumbnail} className="w-full h-40 object-cover group-hover:scale-105 transition" />

        <span className="absolute top-2 left-2 bg-red-600 text-xs px-2 py-0.5 rounded font-semibold">
          LIVE
        </span>

        <span className="absolute bottom-2 left-2 bg-black/70 text-xs px-2 py-0.5 rounded">
          👁 {viewers}
        </span>
      </div>

      <div className="mt-2">
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs text-gray-400">{game}</p>
      </div>
    </div>
  );
}