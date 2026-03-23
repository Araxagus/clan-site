"use client";

import { useState } from "react";
import { updatePage, deletePage } from "./actions";

export default function PageEditor({ page }: any) {
  const [label, setLabel] = useState(page.label);
  const [category, setCategory] = useState(page.category);
  const [subcategory, setSubcategory] = useState(page.subcategory);
  const [content, setContent] = useState(
    typeof page.content === "string"
      ? page.content
      : JSON.stringify(page.content, null, 2)
  );

  async function handleSave() {
    await updatePage(page.id, {
      label,
      category,
      subcategory,
      content,
    });

    alert("Zapisano!");
  }

  async function handleDelete() {
    if (!confirm("Na pewno usunąć stronę?")) return;
    await deletePage(page.id);
    alert("Usunięto stronę!");
  }

  return (
    <div className="p-4 bg-[#111] border border-white/10 rounded">
      <h2 className="text-lg font-semibold mb-4">✏️ Edytuj stronę: {page.label}</h2>

      <div className="space-y-3">
        <input
          className="w-full bg-black/20 p-2 rounded"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        <input
          className="w-full bg-black/20 p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          className="w-full bg-black/20 p-2 rounded"
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
        />

        <textarea
          className="w-full bg-black/20 p-2 rounded h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Zapisz
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Usuń stronę
          </button>
        </div>
      </div>
    </div>
  );
}
