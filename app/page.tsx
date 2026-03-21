"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Game {
  id: string;
  name: string;
  image: string;
  playerCount?: number;
}

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    fetch("/api/games")
      .then((res) => res.json())
      .then((data) => setGames(data))
      .catch(() => setGames([]));
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden text-white bg-black">

      {/* TŁO */}
      <div className="absolute inset-0 bg-black -z-20" />

      {/* KAFELKI */}
      <div className="flex h-full w-full overflow-hidden">
        {games.map((game) => {
          // JEDEN KSZTAŁT DLA WSZYSTKICH
          const clip = "polygon(5% 0, 100% 0, 95% 100%, 0% 100%)";

          return (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className="group relative flex-1 h-full"
              aria-label={`Otwórz ${game.name}`}
            >
              {/* KONTENER */}
              <div
                className="absolute inset-0 overflow-hidden bg-neutral-950"
                style={{ clipPath: clip }}
              >
                {/* OBRAZ — TEN SAM ROZMIAR W KAŻDYM KAFELKU */}
                <img
                  src={game.image}
                  alt={game.name}
                  draggable={false}
                  className="
                    absolute
                    inset-1/2
                    -translate-x-1/2 -translate-y-1/2
                    w-[85%] h-[85%]
                    object-contain
                    transition-transform duration-700 ease-out
                    group-hover:scale-105
                  "
                />

                {/* GRADIENT */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 pointer-events-none" />

                {/* RAMKA */}
                <div className="absolute inset-0 border border-white/10 group-hover:border-white/20 transition pointer-events-none" />

                {/* TEKST */}
                <div className="absolute bottom-6 left-6 z-10">
                  <h3 className="text-2xl font-semibold tracking-widest uppercase drop-shadow-lg">
                    {game.name}
                  </h3>
                  <p className="text-xs text-neutral-400 tracking-wide">
                    {game.playerCount ?? 0} graczy
                  </p>
                </div>

                {/* SUBTELNY GLOW */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                  <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(120,180,255,0.08)]" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* MENU */}
      <div className="absolute top-0 w-full flex justify-between items-center px-8 py-5 z-20">
        <div className="text-lg tracking-[0.35em] text-neutral-300 font-semibold">
          HUNTERS
        </div>

        <div className="flex items-center gap-8 text-sm">
          <Link
            href="/api/auth/signin/discord"
            className="text-neutral-400 hover:text-white transition"
          >
            LOGIN
          </Link>

          <Link
            href="/site/apply"
            className="px-4 py-2 bg-neutral-200 hover:bg-white text-black font-semibold transition"
          >
            APLIKUJ
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <div className="absolute bottom-4 w-full text-center text-neutral-500 text-xs z-20">
        © {new Date().getFullYear()} Hunters Guild
      </div>
    </div>
  );
}
