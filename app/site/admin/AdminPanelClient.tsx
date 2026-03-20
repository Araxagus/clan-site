"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface UserWithStatus {
  id: string;
  name: string | null;
  email: string | null;
  role: "USER" | "MOD" | "ADMIN";
  status: "active" | "pending" | "banned";
  isApproved: boolean;
  createdAt: string;
}

function ConfirmModal({ open, title, message, onConfirm, onClose }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl w-80">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded-lg">
            Anuluj
          </button>

          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 rounded-lg">
            Potwierdź
          </button>
        </div>
      </div>
    </div>
  );
}

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

function AdminUserCard({ user, refresh }: any) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");

  async function handleAction(action: string) {
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "POST",
      credentials: "include", // 🔥 KLUCZOWE
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data);
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
          <p className="text-gray-400 text-sm">{user.email}</p>
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

      <ConfirmModal
        open={modalOpen}
        title="Usuń użytkownika"
        message={`Czy na pewno chcesz usunąć ${user.name}?`}
        onClose={() => setModalOpen(false)}
        onConfirm={() => handleAction(modalAction)}
      />
    </div>
  );
}

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

export default function AdminPanelClient({ users }: any) {
  const [data, setData] = useState<UserWithStatus[]>(users);

  const refresh = async () => {
    const res = await fetch("/api/admin/users", {
      credentials: "include",
    });

    const newData = await res.json();
    setData(newData);
  };

  useEffect(() => {
    refresh();
  }, []);

  const pending = data.filter((u) => !u.isApproved);
  const active = data.filter((u) => u.isApproved && u.status === "active");
  const banned = data.filter((u) => u.status === "banned");

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <header className="flex justify-between mb-10">
        <h1 className="text-3xl font-bold">🛡️ Panel Administratora</h1>

        <Link href="/site/homepage" className="px-5 py-2 bg-gray-700 rounded-lg">
          Powrót
        </Link>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        <AdminSection title="⏳ Oczekujący" users={pending} refresh={refresh} />
        <AdminSection title="🟢 Aktywni" users={active} refresh={refresh} />
        <AdminSection title="⛔ Zbanowani" users={banned} refresh={refresh} />
      </div>
    </div>
  );
}