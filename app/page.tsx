export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-black via-gray-900 to-black text-white">

      {/* HERO */}
      <div className="text-center max-w-3xl">
        <h1 className="text-6xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
          ARAXAGUS CLAN HUB
        </h1>

        <p className="text-xl text-gray-300 mb-10 leading-relaxed">
          Multi‑gaming community. Quinfall, CS, Minecraft, Metin2 i więcej.
          Gramy, streamujemy, memujemy i rozwalamy system.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="/streams"
            className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold text-lg shadow-lg shadow-purple-700/40 transition"
          >
            🔴 Zobacz kto streamuje
          </a>

          <a
            href="/login"
            className="px-8 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 font-semibold text-lg shadow-lg shadow-pink-700/40 transition"
          >
            🔐 Zaloguj się
          </a>
        </div>
      </div>

      {/* GAME GRID */}
      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
        {["Quinfall", "CS", "Minecraft", "Metin2"].map((game) => (
          <div
            key={game}
            className="p-6 bg-gray-800/60 rounded-xl border border-gray-700 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/30 transition text-center font-semibold text-lg"
          >
            {game}
          </div>
        ))}
      </div>

    </div>
  );
}
