"use client";

import { useEffect, useState } from "react";

type Stream = {
  id: string;
  name: string;
  platform: "twitch" | "youtube" | "kick";
  url: string;
  isLive?: boolean;
  viewers?: number;
};

export default function ClanStreamsPage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [activeStream, setActiveStream] = useState<Stream | null>(null);

  const DOMAIN = "localhost"; // 🔥 zmień na produkcji

  /* ================= LOAD + LIVE CHECK ================= */
  useEffect(() => {
    async function load() {
      const data: Stream[] = await fetch("/api/streams/clan").then((r) =>
        r.json()
      );

      const enriched = await Promise.all(
        data.map(async (s) => {
          if (s.platform === "twitch") {
            const channel = s.url.split("twitch.tv/")[1];

            try {
              // simple live detection via thumbnail (exists = live)
              const thumbUrl = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channel}-320x180.jpg`;

              const res = await fetch(thumbUrl, { method: "HEAD" });

              return {
                ...s,
                isLive: res.ok,
                viewers: 0,
              };
            } catch {
              return { ...s, isLive: false };
            }
          }

          // fallback (YouTube / Kick)
          return { ...s, isLive: true };
        })
      );

      // sort LIVE first
      enriched.sort((a, b) => Number(b.isLive) - Number(a.isLive));

      setStreams(enriched);

      const firstLive = enriched.find((s) => s.isLive);
      if (firstLive) setActiveStream(firstLive);
    }

    load();
  }, []);

  /* ================= HELPERS ================= */

  function getTwitchChannel(url: string) {
    return url.split("twitch.tv/")[1];
  }

  function getYouTubeId(url: string) {
    const match = url.match(/[?&]v=([^&]+)/);
    return match?.[1];
  }

  /* ================= EMBED ================= */

  function renderEmbed(stream: Stream) {
    if (stream.platform === "twitch") {
      const channel = getTwitchChannel(stream.url);

      return (
        <iframe
          src={`https://player.twitch.tv/?channel=${channel}&parent=${DOMAIN}&autoplay=true&muted=true`}
          height="480"
          width="100%"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="rounded-xl"
        />
      );
    }

    if (stream.platform === "youtube") {
      const id = getYouTubeId(stream.url);

      return (
        <iframe
          width="100%"
          height="480"
          src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="rounded-xl"
        />
      );
    }

    if (stream.platform === "kick") {
      const username = stream.url.split("/").filter(Boolean).pop();

      return (
        <iframe
          src={`https://kick.com/${username}/live`}
          width="100%"
          height="480"
          allow="autoplay; fullscreen"
          className="rounded-xl"
        />
      );
    }

    return null;
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-black text-white p-10 max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-10 uppercase tracking-widest">
        Streamy klanowe
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">

        {streams.map((s) => {
          const isActive = activeStream?.id === s.id;

          const channel =
            s.platform === "twitch" ? getTwitchChannel(s.url) : null;

          const thumbnail =
            s.platform === "twitch"
              ? `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channel}-440x248.jpg`
              : "https://placehold.co/440x248";

          return (
            <div
              key={s.id}
              onClick={() => setActiveStream(s)}
              className={`group cursor-pointer relative rounded-xl overflow-hidden border transition shadow-xl ${
                isActive
                  ? "border-yellow-400"
                  : "border-gray-800 hover:border-gray-600"
              }`}
            >
              {/* THUMB */}
              <img
                src={thumbnail}
                className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
              />

              {/* HOVER PREVIEW (Twitch only) */}
              {s.platform === "twitch" && (
                <iframe
                  src={`https://player.twitch.tv/?channel=${channel}&parent=${DOMAIN}&autoplay=true&muted=true`}
                  className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition duration-300"
                  allow="autoplay"
                />
              )}

              {/* LIVE BADGE */}
              {s.isLive && (
                <span className="absolute top-2 left-2 bg-red-600 text-xs px-2 py-1 rounded font-bold z-10">
                  LIVE
                </span>
              )}

              {/* INFO */}
              <div className="p-4 relative z-10 bg-black/60">
                <p className="font-semibold">{s.name}</p>
                <p className="text-xs text-gray-400">{s.platform}</p>
              </div>
            </div>
          );
        })}

      </div>

      {/* PLAYER */}
      {activeStream && (
        <div className="border border-gray-800 rounded-2xl p-6 bg-black/60">
          <h2 className="text-xl font-bold mb-4">
            Oglądasz: {activeStream.name}
          </h2>

          {renderEmbed(activeStream)}
        </div>
      )}
    </div>
  );
}