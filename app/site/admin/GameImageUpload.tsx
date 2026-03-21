"use client";

import { useState } from "react";

export default function GameImageUpload({
  value,
  onChange,
}: {
  value?: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    const res = await fetch("/api/games/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    if (data.url) onChange(data.url);
  }

  return (
    <div className="space-y-2">
      {value && (
        <img
          src={value}
          alt="Game"
          className="w-full h-32 object-cover rounded-lg border border-gray-700"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="text-sm"
      />

      {uploading && <p className="text-xs text-gray-400">Uploaduję...</p>}
    </div>
  );
}
