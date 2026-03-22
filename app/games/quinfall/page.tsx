"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Player {
  id: string;
  name: string | null;
  avatar: string | null;
}

type PageKey =
  | "starter"
  | "classes"
  | "economy"
  | "world"
  | "dungeons"
  | "resources"
  | "boss-timers"
  | "crafting";

export default function QuinfallPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState<PageKey>("starter");

  useEffect(() => {
    fetch("/api/quinfall/players")
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(() => {
        setPlayers([]);
        setLoading(false);
      });
  }, []);

  // 🔹 DYNAMIC MENU (nested)
  const menu = [
    {
      category: "Poradniki",
      items: [
        {
          label: "Start",
          items: [
            { key: "starter", label: "Pierwsze kroki" },
            { key: "classes", label: "Wybór klasy" },
          ],
        },
        {
          label: "Ekonomia",
          items: [{ key: "economy", label: "Gold & Crafting" }],
        },
      ],
    },
    {
      category: "Mapy",
      items: [
        {
          label: "Świat",
          items: [{ key: "world", label: "Mapa świata" }],
        },
        {
          label: "PvE",
          items: [
            { key: "dungeons", label: "Dungeony" },
            { key: "resources", label: "Zasoby" },
          ],
        },
      ],
    },
    {
      category: "Narzędzia",
      items: [
        {
          label: "System",
          items: [
            { key: "boss-timers", label: "Boss Timery" },
            { key: "crafting", label: "Crafting" },
          ],
        },
      ],
    },
  ];

  const renderContent = () => {
    switch (activePage) {
      case "starter":
        return <p>Poradnik startowy...</p>;
      case "classes":
        return <p>Opis klas...</p>;
      case "economy":
        return <p>Ekonomia i crafting...</p>;
      case "world":
        return <p>Mapa świata...</p>;
      case "dungeons":
        return <p>Dungeony i bossy...</p>;
      case "resources":
        return <p>Lokacje zasobów...</p>;
      case "boss-timers":
        return <p>Timery bossów...</p>;
      case "crafting":
        return <p>Crafting planner...</p>;
      default:
        return null;
    }
  };

  // 🔹 GROUP PLAYERS (placeholder logic)
  const groupedPlayers = {
    "Online": players.slice(0, Math.ceil(players.length / 2)),
    "Offline": players.slice(Math.ceil(players.length / 2)),
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0c] text-neutral-200">

      {/* TOP BAR */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#0d0d10]">
        <Link
          href="/site/homepage"
          className="text-xs text-neutral-400 hover:text-white"
        >
          ← Powrót
        </Link>

        <h1 className="text-lg tracking-widest uppercase font-semibold text-neutral-300">
          Quinfall Codex
        </h1>

        <div className="text-xs text-neutral-500">
          {players.length} graczy
        </div>
      </div>

      {/* PLAYERS BAR (GROUPED) */}
      <div className="px-6 py-3 border-b border-white/5 space-y-3">

        {loading ? (
          <p className="text-xs text-neutral-500">Ładowanie...</p>
        ) : (
          Object.entries(groupedPlayers).map(([groupName, groupPlayers]) => (
            <div key={groupName}>
              <div className="text-[10px] uppercase text-neutral-500 mb-1">
                {groupName}
              </div>

              <div className="flex gap-3 overflow-x-auto">
                {groupPlayers.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 text-xs">
                    <img
                      src={p.avatar || "/images/default-avatar.png"}
                      className="w-6 h-6 rounded object-cover border border-white/10"
                    />
                    <span className="text-neutral-400 whitespace-nowrap">
                      {p.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <div className="w-60 border-r border-white/10 bg-[#0d0d10] p-4 overflow-y-auto">

          {menu.map((group) => (
            <div key={group.category} className="mb-6">
              <h3 className="text-xs uppercase text-neutral-500 mb-3">
                {group.category}
              </h3>

              <div className="space-y-2">
                {group.items.map((sub) => (
                  <div key={sub.label}>
                    <div className="text-xs text-neutral-400 mb-1">
                      {sub.label}
                    </div>

                    <div className="ml-2 space-y-1 border-l border-white/10 pl-2">
                      {sub.items.map((item) => (
                        <button
                          key={item.key}
                          onClick={() =>
                            setActivePage(item.key as PageKey)
                          }
                          className={`block w-full text-left px-2 py-1 text-sm rounded transition
                            ${
                              activePage === item.key
                                ? "bg-[#1a1a1f] text-white"
                                : "text-neutral-400 hover:bg-[#141418]"
                            }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>

        {/* CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-semibold mb-4 capitalize">
              {activePage.replace("-", " ")}
            </h2>

            <div className="text-neutral-400 text-sm leading-relaxed">
              {renderContent()}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}