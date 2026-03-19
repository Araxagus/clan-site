export default function HomePage() {
  return (
    <div className="flex flex-col items-center text-center py-20 px-4">

      <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text">
        ARAXAGUS CLAN HUB
      </h1>

      <p className="text-lg text-gray-300 max-w-2xl mb-10">
        Multi‑gaming community — Quinfall, CS, Minecraft, Metin2 i więcej.
        Dołącz, graj, streamuj i baw się z ekipą.
      </p>

      <div className="flex gap-6 mt-4">
        <a
          href="/streams"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
        >
          Zobacz kto streamuje
        </a>

        <a
          href="/login"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition"
        >
          Zaloguj się
        </a>
      </div>

      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-300">
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          Quinfall
        </div>
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          CS
        </div>
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          Minecraft
        </div>
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          Metin2
        </div>
      </div>

    </div>
  );
}
