"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      
      <div className="w-full max-w-md p-8 rounded-2xl border border-slate-700 bg-slate-900/60 backdrop-blur-xl shadow-2xl">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Hunters Clan
          </h1>
          <p className="text-slate-400 mt-2">
            Zaloguj się, aby uzyskać dostęp do panelu
          </p>
        </div>

        {/* BUTTON */}
        <button
          onClick={() => signIn("discord", { callbackUrl: "/site/homepage" })}
          className="w-full flex items-center justify-center gap-3 rounded-xl bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-500 transition shadow-lg hover:shadow-indigo-500/30"
        >
          <DiscordIcon />
          Zaloguj przez Discord
        </button>

        {/* FOOTER */}
        <p className="text-xs text-slate-500 text-center mt-6">
          Logowanie odbywa się przez Discord OAuth
        </p>

      </div>
    </main>
  );
}

/* 🔥 PROSTY ICON DISCORD */
function DiscordIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-white"
    >
      <path d="M20 4.5A16.5 16.5 0 0 0 16.1 3l-.2.4a15 15 0 0 1 3.5 1.1 13 13 0 0 0-1.4-2.2zM7.9 3A16.5 16.5 0 0 0 4 4.5c-.5.7-1 1.4-1.4 2.2A15 15 0 0 1 6.1 5l-.2-.4zM12 7c-3.3 0-6 2.5-6 5.5S8.7 18 12 18s6-2.5 6-5.5S15.3 7 12 7zm-2 6.5c-.8 0-1.5-.7-1.5-1.5S9.2 10.5 10 10.5s1.5.7 1.5 1.5S10.8 13.5 10 13.5zm4 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" />
    </svg>
  );
}