"use client";

import { useEffect, useState } from "react";

function getElapsedTime(start: string | null) {
  if (!start) return null;

  const startDate = new Date(start);
  const now = new Date();

  const diff = Math.floor((now.getTime() - startDate.getTime()) / 1000);

  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);

  return `${hours}h ${minutes}m`;
}

export default function OnlineList() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users/status");
        const data = await res.json();
        setUsers(data);
      } catch (e) {
        console.warn("Users fetch failed");
      }
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 15000);

    return () => clearInterval(interval);
  }, []);

  const onlineUsers = users.filter((u) => u.isOnline);
  const offlineUsers = users.filter((u) => !u.isOnline);

  function UserCard({ user }: any) {
    // ✅ fallback zabezpieczenie
    const statusMeta = user.statusMeta || {
      label: "Offline",
      color: "bg-gray-500",
    };

    const elapsed = getElapsedTime(user.activityStart);

    return (
      <div
        className={`p-3 rounded-xl border transition ${
          user.isOnline
            ? "border-green-500/40 bg-green-500/5"
            : "border-gray-800 bg-black/40 opacity-60"
        }`}
      >
        <div className="flex items-center gap-3">

          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold">
            {user.name?.[0]}
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold">{user.name}</p>

            {/* STATUS */}
            <div className="text-xs text-gray-400 flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${statusMeta.color}`}
              />
              {statusMeta.label}
            </div>

            {/* ACTIVITY */}
            {user.discordActivity && (
              <div className="text-xs text-blue-400 mt-1">
                {user.discordActivity}
              </div>
            )}

            {/* TIME */}
            {elapsed && (
              <div className="text-xs text-gray-500 mt-1">
                ⏱ {elapsed}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-gray-800 p-4 h-screen overflow-y-auto bg-black/60">

      {/* ONLINE */}
      <h3 className="text-sm font-semibold text-green-400 mb-3">
        🟢 Online ({onlineUsers.length})
      </h3>

      <div className="space-y-3 mb-6">
        {onlineUsers.map((u) => (
          <UserCard key={u.id} user={u} />
        ))}
      </div>

      {/* OFFLINE */}
      <h3 className="text-sm font-semibold text-gray-400 mb-3">
        ⚫ Offline ({offlineUsers.length})
      </h3>

      <div className="space-y-3 opacity-60">
        {offlineUsers.map((u) => (
          <UserCard key={u.id} user={u} />
        ))}
      </div>

    </div>
  );
}