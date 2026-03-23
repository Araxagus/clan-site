"use client";

import { useState } from "react";
import { createPage } from "./actions";

export default function PageCreator({ gameId }: { gameId: string }) {
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [content, setContent] = useState("");

  async function handleCreate() {
    await createPage(gameId, {
      key,
      label,
      category,
      subcategory,
      content,
    });

    setKey("");
    setLabel("");
    setCategory("");
    setSubcategory("");
    setContent("");

    alert("Strona została dodana!");
  }

  return (
    <div className="p-4 bg-[#111] border border-white/10 rounded">
      <h2 className="text-lg font-semibold mb-4">➕ Dodaj nową stronę</h2>

      <div className="space-y-3">
        <input
          className="w-full bg-black/20 p-2 rounded"
          placeholder="Unikalny key (np. starter)"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />

        <input
          className="w-full bg-black/20 p-2 rounded"
          placeholder="Tytuł strony"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        <input
          className="w-full bg-black/20 p-2 rounded"
          placeholder="Kategoria (np. Poradniki)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          className="w-full bg-black/20 p-2 rounded"
          placeholder="Podkategoria (np. Start)"
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
        />

        <textarea
          className="w-full bg-black/20 p-2 rounded h-40"
          placeholder="Treść (markdown / tekst)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Dodaj stronę
        </button>
      </div>
    </div>
  );
}
