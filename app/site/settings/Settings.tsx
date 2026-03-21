"use client";

import { useEffect, useState } from "react";

export default function Settings({ initialUser, initialGames }: any) {
  const [user, setUser] = useState<any>(initialUser);
  const [games] = useState<any[]>(initialGames);

  const [selectedGames, setSelectedGames] = useState<string[]>(
    Array.isArray(initialUser.games)
      ? initialUser.games.map((x: any) => x.id)
      : []
  );

  const [loadingSteam, setLoadingSteam] = useState(false);

  /* ================= STEAM LOAD ================= */
  useEffect(() => {
    async function loadSteam() {
      if (!user.steamId) return;

      setLoadingSteam(true);

      try {
        const res = await fetch(`/api/steam/profile?user=${user.id}`);

        if (!res.ok) {
          console.warn("Steam request failed");
          setLoadingSteam(false);
          return;
        }

        const steam = await res.json();

        if (steam.error) {
          console.warn("Steam error:", steam.error);
          setLoadingSteam(false);
          return;
        }

        setUser((prev: any) => ({
          ...prev,
          steamAvatar: steam.steamAvatar,
          steamName: steam.steamName,
          steamGame: steam.steamGame,
          steamOnline: steam.steamOnline,
          steamProfile: steam.steamProfile,
        }));
      } catch (err) {
        console.warn("Steam fetch crash", err);
      }

      setLoadingSteam(false);
    }

    loadSteam();
  }, [user.steamId, user.id]);

  /* ================= SAVE ================= */
  async function save() {
    await fetch("/api/users/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        twitchUrl: user.twitchUrl,
        youtubeUrl: user.youtubeUrl,
        kickUrl: user.kickUrl,
        games: selectedGames,
      }),
    });

    alert("Zapisano!");
  }

  return (
    <div className="min-h-screen bg-black text-white p-10 max-w-3xl mx-auto">

      <h1 className="text-3xl font-bold mb-10">Ustawienia gracza</h1>

      {/* STREAMY */}
      <div className="space-y-4 mb-10">
        <input
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
          placeholder="Twitch URL"
          value={user.twitchUrl || ""}
          onChange={(e) => setUser({ ...user, twitchUrl: e.target.value })}
        />
        <input
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
          placeholder="YouTube URL"
          value={user.youtubeUrl || ""}
          onChange={(e) => setUser({ ...user, youtubeUrl: e.target.value })}
        />
        <input
          className="w-full p-2 bg-gray-900 border border-gray-700 rounded"
          placeholder="Kick URL"
          value={user.kickUrl || ""}
          onChange={(e) => setUser({ ...user, kickUrl: e.target.value })}
        />
      </div>

      {/* STEAM */}
      <div className="space-y-4 mb-10">

        {!user.steamId && (
          <a
            href="/api/steam/login"
            className="flex items-center gap-4 p-4 bg-[#171a21] border border-[#2a475e] rounded-xl hover:bg-[#1b1e25] transition shadow-lg"
          >
            <img
              src="https://community.cloudflare.steamstatic.com/public/shared/images/header/logo_steam.svg"
              alt="Steam"
              className="h-8"
            />
            <span className="text-white font-semibold tracking-wide">
              Połącz konto Steam
            </span>
          </a>
        )}

        {user.steamId && (
          <div className="p-5 bg-[#171a21] border border-[#2a475e] rounded-xl shadow-lg">

            <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
              Połączono z Steam
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  user.steamOnline ? "bg-green-600" : "bg-gray-600"
                }`}
              >
                {user.steamOnline ? "ONLINE" : "OFFLINE"}
              </span>
            </p>

            <div className="flex items-center gap-4">

              {/* AVATAR */}
              <img
                src={user.steamAvatar || "https://placehold.co/100x100"}
                className={`w-16 h-16 rounded-xl border border-[#2a475e] object-cover ${
                  loadingSteam ? "opacity-50 animate-pulse" : ""
                }`}
              />

              {/* INFO */}
              <div className="flex-1">
                <p className="font-semibold text-white text-lg">
                  {loadingSteam
                    ? "Ładowanie..."
                    : user.steamName || "Użytkownik Steam"}
                </p>

                {!loadingSteam && (
                  <>
                    {user.steamOnline ? (
                      <p className="text-green-400 text-sm mt-1">
                        Online{" "}
                        {user.steamGame
                          ? `— gra w ${user.steamGame}`
                          : ""}
                      </p>
                    ) : (
                      <p className="text-gray-500 text-sm mt-1">Offline</p>
                    )}
                  </>
                )}

                {user.steamGame && (
                  <p className="text-xs text-gray-400 mt-1">
                    🎮 {user.steamGame}
                  </p>
                )}

                {user.steamProfile && (
                  <a
                    href={user.steamProfile}
                    target="_blank"
                    className="text-blue-400 text-sm hover:underline mt-1 inline-block"
                  >
                    Otwórz profil Steam
                  </a>
                )}
              </div>

              {/* DISCONNECT */}
              <button
                onClick={async () => {
                  await fetch("/api/steam/disconnect", { method: "POST" });
                  window.location.reload();
                }}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500"
              >
                Odłącz
              </button>
            </div>
          </div>
        )}

      </div>

      {/* GRY */}
      <h2 className="text-xl font-bold mb-4">Gry, w które grasz</h2>

      <div className="space-y-2 mb-10">
        {games.map((g) => (
          <label key={g.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedGames.includes(g.id)}
              onChange={() => {
                if (selectedGames.includes(g.id)) {
                  setSelectedGames(selectedGames.filter((x) => x !== g.id));
                } else {
                  setSelectedGames([...selectedGames, g.id]);
                }
              }}
            />
            {g.name}
          </label>
        ))}
      </div>

      <button
        onClick={save}
        className="px-6 py-3 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400"
      >
        Zapisz ustawienia
      </button>
    </div>
  );
}
