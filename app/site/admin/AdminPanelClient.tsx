"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ===== HELPERS ===== */
function maskEmail(email: string | null) {
  if (!email) return "brak";
  const [name, domain] = email.split("@");
  return name.slice(0, 4) + "****@" + domain;
}

/* ===== TYPES ===== */
interface UserWithStatus {
  id: string;
  name: string | null;
  email: string | null;
  role: "USER" | "MOD" | "ADMIN";
  status: "active" | "pending" | "banned";
  isApproved: boolean;
  createdAt: string;
}

interface Game {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

/* ===== BUTTON ===== */
function AdminButton({ label, color, onClick }: any) {
  const colors: any = {
    green: "bg-green-600 hover:bg-green-700",
    red: "bg-red-600 hover:bg-red-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    yellow: "bg-yellow-600 hover:bg-yellow-700",
    gray: "bg-gray-600 hover:bg-gray-700",
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs rounded-lg font-semibold ${colors[color]}`}
    >
      {label}
    </button>
  );
}

/* ===== USER CARD ===== */
function AdminUserCard({ user, refresh }: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");

  async function handleAction(action: string) {
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error");
      return;
    }

    await refresh();
  }

  const color =
    user.status === "banned"
      ? "red"
      : user.isApproved
      ? "green"
      : "yellow";

  return (
    <div className="bg-gray-800/60 p-4 rounded-xl border border-gray-700">
      <div className="flex justify-between">
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-gray-400 text-sm">{maskEmail(user.email)}</p>
          <p className={`text-${color}-400 text-xs mt-1`}>
            {user.role} • {user.status}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {!user.isApproved && (
            <>
              <AdminButton label="Approve" color="green" onClick={() => handleAction("approve")} />
              <AdminButton label="Reject" color="red" onClick={() => handleAction("reject")} />
            </>
          )}

          {user.role !== "ADMIN" && user.isApproved && (
            <AdminButton label="Promote" color="blue" onClick={() => handleAction("promote")} />
          )}

          {user.role === "ADMIN" && (
            <AdminButton label="Demote" color="yellow" onClick={() => handleAction("demote")} />
          )}

          {user.status !== "banned" && (
            <AdminButton label="Ban" color="red" onClick={() => handleAction("ban")} />
          )}

          <AdminButton
            label="Delete"
            color="gray"
            onClick={() => {
              setModalAction("delete");
              setModalOpen(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ===== USER SECTION ===== */
function AdminSection({ title, users, refresh }: any) {
  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="space-y-4">
        {users.map((user: any) => (
          <AdminUserCard key={user.id} user={user} refresh={refresh} />
        ))}
      </div>
    </div>
  );
}

/* ===== MAIN PANEL ===== */
export default function AdminPanelClient({ users, games }: any) {
  const [data, setData] = useState<UserWithStatus[]>(users);
  const [gameList, setGameList] = useState<Game[]>(games);

  /* === REFRESH USERS === */
  const refreshUsers = async () => {
    const res = await fetch("/api/admin/users", { credentials: "include" });
    const newData = await res.json();
    setData(newData);
  };

  /* === REFRESH GAMES === */
  const refreshGames = async () => {
    const res = await fetch("/api/admin/games");
    const newGames = await res.json();
    setGameList(newGames);
  };

  useEffect(() => {
    refreshUsers();
    refreshGames();
  }, []);

  const pending = data.filter((u) => !u.isApproved);
  const active = data.filter((u) => u.isApproved && u.status === "active");
  const banned = data.filter((u) => u.status === "banned");

  /* === ADD GAME === */
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newImage, setNewImage] = useState("");

  async function addGame() {
    if (!newName || !newSlug) return alert("Nazwa i slug są wymagane");

    const res = await fetch("/api/admin/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        slug: newSlug,
        image: newImage,
      }),
    });

    if (!res.ok) return alert("Błąd podczas dodawania gry");

    setNewName("");
    setNewSlug("");
    setNewImage("");

    refreshGames();
  }

  async function deleteGame(id: string) {
    if (!confirm("Na pewno chcesz usunąć tę grę?")) return;

    const res = await fetch(`/api/admin/games/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) return alert("Błąd podczas usuwania gry");

    refreshGames();
  }

  return (
    <div className="min-h-screen bg-black text-white p-10 space-y-10">
      <header className="flex justify-between mb-10">
        <h1 className="text-3xl font-bold">🛡️ Panel Administratora</h1>

        <Link href="/site/homepage" className="px-5 py-2 bg-gray-700 rounded-lg">
          Powrót
        </Link>
      </header>

      {/* === USERS === */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <AdminSection title="⏳ Oczekujący" users={pending} refresh={refreshUsers} />
        <AdminSection title="🟢 Aktywni" users={active} refresh={refreshUsers} />
        <AdminSection title="⛔ Zbanowani" users={banned} refresh={refreshUsers} />
      </div>

      {/* === GAMES === */}
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">🎮 Gry</h2>

        {/* ADD GAME */}
        <div className="flex gap-3 mb-6">
          <input
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
            placeholder="Nazwa gry"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <input
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
            placeholder="Slug (np. quinfall)"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
          />

          <input
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
            placeholder="URL obrazka (opcjonalnie)"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
          />

          <button
            onClick={addGame}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
          >
            Dodaj
          </button>
        </div>

        {/* GAME LIST */}
        <div className="space-y-4">
          {gameList.map((game) => (
            <div
              key={game.id}
              className="flex items-center justify-between bg-gray-800/60 p-4 rounded-xl border border-gray-700"
            >
              <div>
                <p className="font-semibold">{game.name}</p>
                <p className="text-gray-400 text-sm">/{game.slug}</p>
              </div>

              <div className="flex gap-3">
                <a
                  href={`/games/${game.slug}`}
                  className="px-3 py-1 text-xs rounded-lg font-semibold bg-blue-600 hover:bg-blue-700"
                >
                  Otwórz
                </a>

                <button
                  onClick={() => deleteGame(game.id)}
                  className="px-3 py-1 text-xs rounded-lg font-semibold bg-red-600 hover:bg-red-700"
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
