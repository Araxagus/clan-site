import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="relative h-[90vh] flex items-center justify-center text-center px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            HUNTERS CLAN
          </h1>

          <p className="mt-6 text-gray-400 text-lg">
            Klan graczy skupiony na PvP, PvE i wspólnej dominacji w wielu grach.
          </p>

          <div className="mt-8 flex gap-4 justify-center">
            <Link
              href="/site/login"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition"
            >
              Dołącz / Login
            </Link>

            <Link
              href="#games"
              className="px-6 py-3 border border-gray-600 hover:border-purple-500 rounded-xl transition"
            >
              Zobacz gry
            </Link>
          </div>
        </div>
      </section>

      {/* GAMES */}
      <section id="games" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Gry w których działamy
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            "Quinfall",
            "Counter-Strike 2",
            "Metin2",
            "Gothic II",
            "ARK: Survival Ascended",
            "Life is Feudal",
          ].map((game) => (
            <div
              key={game}
              className="p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-purple-500 transition"
            >
              <h3 className="text-xl font-semibold">{game}</h3>
              <p className="text-gray-400 mt-2 text-sm">
                Aktywna społeczność, eventy, PvP i współpraca.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-20 px-6 bg-gray-950 border-t border-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">O klanie</h2>

          <p className="text-gray-400 leading-relaxed">
            Hunters to społeczność graczy nastawionych na rozwój, rywalizację i wspólne granie.
            Organizujemy wyprawy, PvP, farmy i wydarzenia w wielu grach MMO i survival.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Chcesz dołączyć?
        </h2>

        <p className="text-gray-400 mb-8">
          Zaloguj się i złóż aplikację do klanu.
        </p>

        <Link
          href="/site/login"
          className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition"
        >
          Rozpocznij
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-gray-500 border-t border-gray-800">
        © {new Date().getFullYear()} Hunters Clan
      </footer>
    </main>
  );
}