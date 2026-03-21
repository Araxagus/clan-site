"use client";

import { useState } from "react";
import GameImageUpload from "./GameImageUpload";

export default function AddGame({ refresh }: { refresh: () => void }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const [previewOpen, setPreviewOpen] = useState(false);

  // 🔥 Placeholder = screen z Twojej strony głównej
  const homepagePreview =
    "https://hunters-nu.vercel.app/_next/image?url=%2Fbg%2Fhomepage.jpg&w=1920&q=75";

  async function addGame() {
    await fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image }),
    });

    setName("");
    setImage(undefined);
    refresh();
  }

  return (
    <div className="bg-gray-900 p-5 rounded-xl border border-gray-700 space-y-5">
      <h2 className="text-xl font-bold">➕ Dodaj grę</h2>

      {/* NAZWA GRY */}
      <div className="space-y-1">
        <label className="text-sm text-gray-300">Nazwa gry</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Np. Quinfall, Ark, Conan..."
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />
      </div>

      {/* PODGLĄD KAFELKA */}
      <div className="space-y-2">
        <label className="text-sm text-gray-300">Podgląd kafelka na stronie głównej</label>

        <div
          onClick={() => setPreviewOpen(true)}
          className="relative group w-full h-40 rounded-xl overflow-hidden border border-gray-700 bg-gray-800 cursor-pointer hover:scale-[1.02] transition"
        >
          {/* 🔥 ZAWSZE pokazujemy layout strony głównej */}
          <img
            src={image || homepagePreview}
            alt="preview"
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
          />

          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition" />

          <div className="absolute bottom-3 left-3">
            <h3 className="text-lg font-bold drop-shadow-lg">
              {name || "Nazwa gry"}
            </h3>
            <p className="text-xs text-gray-300">0 graczy</p>
          </div>

          <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs">
            Kliknij, aby powiększyć
          </div>
        </div>
      </div>

      {/* MODAL POWIĘKSZENIA */}
      {previewOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setPreviewOpen(false)}
        >
          <img
            src={image || homepagePreview}
            className="max-w-[90%] max-h-[90%] rounded-xl shadow-xl"
          />
        </div>
      )}

      {/* UPLOAD OBRAZKA */}
      <div className="space-y-2">
        <label className="text-sm text-gray-300">Wybierz obraz do kafelka</label>
        <p className="text-xs text-gray-500">
          Ten obraz zastąpi tło kafelka na stronie głównej.
        </p>

        <GameImageUpload value={image} onChange={setImage} />
      </div>

      {/* PRZYCISK DODAWANIA */}
      <button
        onClick={addGame}
        className="px-4 py-2 bg-green-600 rounded-lg font-semibold w-full hover:bg-green-700 transition"
      >
        Dodaj grę
      </button>
    </div>
  );
}
