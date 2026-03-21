"use client";

export default function GamesList({ games, refresh }: any) {
  async function remove(id: string) {
    await fetch(`/api/games/${id}`, { method: "DELETE" });
    refresh();
  }

  return (
    <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
      <h2 className="text-xl font-bold mb-3">🎮 Lista gier</h2>

      <div className="space-y-2">
        {games.map((g: any) => (
          <div
            key={g.id}
            className="flex justify-between bg-gray-800 p-3 rounded-lg border border-gray-700"
          >
            <span>{g.name}</span>

            <button
              onClick={() => remove(g.id)}
              className="px-3 py-1 bg-red-600 rounded-lg text-sm"
            >
              Usuń
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
