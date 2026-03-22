"use client";

import { useState } from "react";

// Typ zgodny z Prisma.JsonValue, ale bez importu Prisma (bo to client component)
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

// Typ pojedynczej strony gry
interface GamePage {
  id: string;
  key: string;
  label: string;
  category: string;
  subcategory: string;
  order: number;
  content: JSONValue;
}

// Typ gry przekazywanej z serwera
interface Game {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  pages: GamePage[];
}

export default function GameClient({ game }: { game: Game }) {
  const [activeKey, setActiveKey] = useState<string | null>(
    game.pages[0]?.key ?? null
  );

  const activePage =
    game.pages.find((p) => p.key === activeKey) ?? null;

  // Grupowanie stron
  const groups: Record<string, Record<string, GamePage[]>> = {};

  game.pages.forEach((p) => {
    if (!groups[p.category]) groups[p.category] = {};
    if (!groups[p.category][p.subcategory])
      groups[p.category][p.subcategory] = [];
    groups[p.category][p.subcategory].push(p);
  });

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0c] text-neutral-200">

      {/* TOP */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#0d0d10]">
        <h1 className="text-lg tracking-widest uppercase font-semibold text-neutral-300">
          {game.name} Codex
        </h1>
        <div className="text-xs text-neutral-500">
          {game.pages.length} stron
        </div>
      </div>

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <div className="w-60 border-r border-white/10 bg-[#0d0d10] p-4 overflow-y-auto">
          {Object.entries(groups).map(([category, subs]) => (
            <div key={category} className="mb-6">
              <h3 className="text-xs uppercase text-neutral-500 mb-3">
                {category}
              </h3>

              {Object.entries(subs).map(([sub, items]) => (
                <div key={sub} className="mb-2">
                  <div className="text-xs text-neutral-400 mb-1">{sub}</div>

                  <div className="ml-2 space-y-1 border-l border-white/10 pl-2">
                    {items.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setActiveKey(item.key)}
                        className={`block w-full text-left px-2 py-1 text-sm rounded transition
                          ${
                            activeKey === item.key
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
          ))}
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-semibold mb-4 capitalize">
              {activePage?.label ?? "Brak treści"}
            </h2>

            <div className="text-neutral-400 text-sm leading-relaxed">
              {renderContent(activePage)}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function renderContent(page: GamePage | null) {
  if (!page) return "Brak treści.";

  if (typeof page.content === "string") return page.content;

  if (typeof page.content === "object" && page.content !== null) {
    return (
      <pre className="text-xs bg-black/20 p-3 rounded border border-white/5">
        {JSON.stringify(page.content, null, 2)}
      </pre>
    );
  }

  return "Brak treści.";
}
