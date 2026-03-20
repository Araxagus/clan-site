export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-black via-gray-900 to-black text-white">

      {/* LOGO */}
      <div className="mb-10">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-xl shadow-purple-700/40">
          <span className="text-4xl font-extrabold">A</span>
        </div>
      </div>

      {/* HERO */}
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
          ARAXAGUS CLAN HUB
        </h1>

        <p className="text-lg text-gray-300 mb-10 leading-relaxed">
          Multi‑gaming community dla ludzi, którzy grają, streamują, memują i chcą
          być częścią czegoś większego. Quinfall, CS, Minecraft, Metin2 i więcej.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="/site/login"
            className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold text-lg shadow-lg shadow-purple-700/40 transition"
          >
            🔐 Zaloguj się
          </a>

          <a
            href="/site/apply"
            className="px-8 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 font-semibold text-lg shadow-lg shadow-pink-700/40 transition"
          >
            📝 Aplikuj do klanu
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} Araxagus — Community Hub
      </div>
    </div>
  );
}
