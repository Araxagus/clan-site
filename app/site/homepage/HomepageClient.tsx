"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import UserPanel from "../components/UserPanel";

export default function HomepageClient({ session, games, streams }: any) {
  const [activeStream, setActiveStream] = useState<any>(null);
  const [liveStreams, setLiveStreams] = useState<any[]>(streams || []);
  const [showOffline, setShowOffline] = useState(false);

  // 🔥 AUTOMATYCZNA DOMENA (działa lokalnie i na Vercelu)
  const DOMAIN =
    process.env.NEXT_PUBLIC_DOMAIN ||
    (typeof window !== "undefined"
      ? window.location.hostname
      : "localhost");

  /* ================= REALTIME STATUS ================= */
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/streams/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ streams: liveStreams }),
        });

        const updated = await res.json();
        setLiveStreams(updated);
      } catch {
        console.warn("Status update failed");
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  /* ================= HELPERS ================= */

  function getTwitchChannel(url: string) {
    return url.replace(/https?:\/\/(www\.)?twitch\.tv\//, "");
  }

  function getYouTubeId(url: string) {
    const match = url.match(/[?&]v=([^&]+)/);
    return match?.[1];
  }

  const live = liveStreams.filter((s) => s.isLive);
  const offline = liveStreams.filter((s) => !s.isLive);

  /* ================= PREVIEW ================= */

  function renderPreview(stream: any) {
    const channel =
      stream.platform === "twitch"
        ? getTwitchChannel(stream.url)
        : null;

    if (!stream.isLive) {
      return (
        <div className="w-full h-40 flex items-center justify-center bg-gray-900 text-gray-400 text-sm rounded">
          Stream offline
        </div>
      );
    }

    if (stream.platform === "twitch" && channel) {
      const thumb = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channel}-440x248.jpg`;

      return (
        <div className="relative w-full h-40 rounded overflow-hidden">
          <img src={thumb} className="w-full h-full object-cover" />

          <span className="absolute top-2 left-2 bg-red-600 text-xs px-2 py-0.5 rounded font-semibold">
            LIVE
          </span>
        </div>
      );
    }

    if (stream.platform === "youtube") {
      const id = getYouTubeId(stream.url);
      if (!id) {
        return (
          <div className="w-full h-40 bg-gray-900 rounded flex items-center justify-center">
            Brak podglądu
          </div>
        );
      }

      return (
        <iframe
          className="w-full h-40 rounded"
          src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1`}
          allow="autoplay"
        />
      );
    }

    return (
      <div className="w-full h-40 bg-gray-900 flex items-center justify-center text-gray-400 text-sm rounded">
        Podgląd niedostępny
      </div>
    );
  }

  /* ================= BIG PLAYER ================= */

  function renderBigPlayer(stream: any) {
    if (!stream) return null;

    if (stream.platform === "twitch") {
      const channel = getTwitchChannel(stream.url);

      return (
        <iframe
          key={stream.id}
          src={`https://player.twitch.tv/?channel=${channel}&parent=${DOMAIN}&autoplay=true&muted=false`}
          className="w-full h-[500px] rounded-xl"
          allowFullScreen
        />
      );
    }

    if (stream.platform === "youtube") {
      const id = getYouTubeId(stream.url);
      if (!id) return null;

      return (
        <iframe
          key={stream.id}
          className="w-full h-[500px] rounded-xl"
          src={`https://www.youtube.com/embed/${id}?autoplay=1`}
          allowFullScreen
        />
      );
    }

    return null;
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-black text-white flex justify-between">

      <div className="flex-1 max-w-7xl mx-auto p-10">

        {/* HEADER */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <UserPanel user={session.user} />
            <div>
              <h1 className="text-3xl font-extrabold uppercase tracking-widest">
                Hunters Clan
              </h1>
              <p className="text-gray-500 text-sm">
                Wybierz swoją grę
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-400">
            Witaj{" "}
            <span className="text-white font-semibold">
              {session.user?.name}
            </span>
          </div>
        </header>

        {/* GAMES */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-6 uppercase">
            Gry klanowe
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {games?.map((g: any) => (
              <Link
                key={g.id}
                href={`/site/${g.id}`}
                className="group relative rounded-xl overflow-hidden border border-gray-800 bg-black/20 hover:bg-black/40 transition"
              >
                <img
                  src={g.image || "/images/default-game.png"}
                  className="absolute inset-0 w-full h-full object-contain opacity-40 group-hover:opacity-60 transition"
                />

                <div className="relative p-6 z-10">
                  <h3 className="text-lg font-semibold uppercase group-hover:text-yellow-400">
                    {g.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {g.playerCount} graczy
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* STREAMS — JEDYNA SEKCJA */}
        <div className="border-t border-gray-800 pt-12">

          {/* LIVE HEADER */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-red-500">
              🔴 LIVE ({live.length})
            </h3>

            <Link
              href="/site/streams"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Zobacz wszystkie →
            </Link>
          </div>

          {live.length === 0 && (
            <p className="text-gray-500 text-sm mb-6">
              Nikt nie streamuje w tym momencie.
            </p>
          )}

          {/* LIVE GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
            {live.map((s: any) => (
              <button
                key={s.id}
                onClick={() => setActiveStream(s)}
                className="text-left group w-full"
              >
                <div className="relative rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition">
                  {renderPreview(s)}

                  <span className="absolute bottom-2 left-2 bg-black/70 text-xs px-2 py-0.5 rounded capitalize">
                    {s.platform}
                  </span>
                </div>

                <div className="mt-2 flex justify-between items-center">
                  <p className="text-sm font-semibold">{s.name}</p>

                  <span className="text-xs text-yellow-400 group-hover:underline">
                    Oglądaj →
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* OFFLINE */}
          <button
            onClick={() => setShowOffline(!showOffline)}
            className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            ⚫ Offline ({offline.length})
            <span>{showOffline ? "▲" : "▼"}</span>
          </button>

          {showOffline && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {offline.map((s: any) => (
                <div key={s.id} className="opacity-60">
                  <div className="relative rounded-xl overflow-hidden border border-gray-800">
                    {renderPreview(s)}

                    <span className="absolute top-2 left-2 bg-gray-600 text-xs px-2 py-0.5 rounded font-semibold">
                      OFFLINE
                    </span>

                    <span className="absolute bottom-2 left-2 bg-black/70 text-xs px-2 py-0.5 rounded capitalize">
                      {s.platform}
                    </span>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="text-xs text-gray-500">
                      Aktualnie offline
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BIG PLAYER */}
        {activeStream && (
          <div className="mt-16 border border-gray-800 rounded-2xl p-6 bg-black/60 relative">

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setActiveStream(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">
              Oglądasz: {activeStream.name}
            </h2>

            {renderBigPlayer(activeStream)}
          </div>
        )}

      </div>
    </div>
  );
}
