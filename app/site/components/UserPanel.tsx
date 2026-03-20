"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function UserPanel({ user }: any) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAdmin = user?.role === "ADMIN"; // 👈 KLUCZOWE

  return (
    <div ref={ref} className="relative">
      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 bg-gray-900/60 hover:bg-gray-800 px-4 py-2 rounded-xl transition border border-gray-700"
      >
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">
          {user?.name?.[0] || "U"}
        </div>
        <span className="text-sm font-medium">{user.name}</span>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute left-0 mt-2 w-52 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">

          <Link
            href="/site/profile"
            className="block px-4 py-2 text-sm hover:bg-gray-800 transition"
          >
            👤 Profil
          </Link>

          <Link
            href="/site/settings"
            className="block px-4 py-2 text-sm hover:bg-gray-800 transition"
          >
            ⚙️ Ustawienia
          </Link>

          {/* 👇 PANEL ADMINA (TYLKO ADMIN) */}
          {isAdmin && (
            <>
              <div className="border-t border-gray-700 my-1" />

              <Link
                href="/site/admin"
                className="block px-4 py-2 text-sm text-yellow-400 hover:bg-yellow-500/10 transition"
              >
                🛠 Panel admina
              </Link>
            </>
          )}

          <div className="border-t border-gray-700 my-1" />

          <Link
            href="/api/auth/signout"
            className="block px-4 py-2 text-sm text-red-400 hover:bg-red-600/20 transition"
          >
            🚪 Wyloguj
          </Link>

        </div>
      )}
    </div>
  );
}