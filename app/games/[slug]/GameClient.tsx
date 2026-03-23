"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { createPage, updatePage, deletePage } from "./actions";

const TiptapEditor = dynamic(() => import("./TiptapEditor"), {
  ssr: false,
});

/* ---------------- TYPES ---------------- */

type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

interface GamePage {
  id: string;
  key: string;
  label: string;
  category: string;
  subcategory: string;
  order: number;
  content: JSONValue;
}

interface Game {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  pages: GamePage[];
}

/* ---------------- MODAL ---------------- */

function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#0f0f14] border border-white/10 rounded-xl p-5 w-[420px] shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-neutral-200">
            {title}
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------------- MAIN ---------------- */

export default function GameClient({
  game,
  isAdmin,
}: {
  game: Game;
  isAdmin: boolean;
}) {
  const [pages, setPages] = useState<GamePage[]>(game.pages);
  const [activeId, setActiveId] = useState<string | null>(
    game.pages[0]?.id ?? null
  );

  const [categories, setCategories] = useState<string[]>(
    Array.from(new Set(game.pages.map((p) => p.category)))
  );

  const [subcategories, setSubcategories] = useState<Record<string, string[]>>(
    () => {
      const map: Record<string, Set<string>> = {};

      for (const p of game.pages) {
        if (!map[p.category]) map[p.category] = new Set();
        map[p.category].add(p.subcategory);
      }

      const result: Record<string, string[]> = {};
      Object.entries(map).forEach(([cat, subs]) => {
        result[cat] = Array.from(subs);
      });

      return result;
    }
  );

  const [isEditing, setIsEditing] = useState(false);
  const [draftPage, setDraftPage] = useState<GamePage | null>(null);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createType, setCreateType] = useState<
    "category" | "subcategory" | "page" | null
  >(null);

  const [createCategory, setCreateCategory] = useState("");
  const [createSubcategory, setCreateSubcategory] = useState("");
  const [createLabel, setCreateLabel] = useState("");

  const activePage = pages.find((p) => p.id === activeId) ?? null;

  /* ---------------- CREATE ---------------- */

  function openCreate(type: "category" | "subcategory" | "page") {
    setCreateType(type);
    setCreateModalOpen(true);
  }

  async function handleCreate() {
    if (!createType) return;

    if (createType === "category") {
      if (!createCategory) return;

      setCategories((prev) => [...prev, createCategory]);
      setSubcategories((prev) => ({
        ...prev,
        [createCategory]: [],
      }));
    }

    if (createType === "subcategory") {
      if (!createCategory || !createSubcategory) return;

      setSubcategories((prev) => ({
        ...prev,
        [createCategory]: [
          ...(prev[createCategory] || []),
          createSubcategory,
        ],
      }));
    }

    if (createType === "page") {
      if (!createCategory || !createSubcategory || !createLabel) return;

      const res = await createPage(game.id, {
        key: `page-${Date.now()}`,
        label: createLabel,
        category: createCategory,
        subcategory: createSubcategory,
        content: "<p>Nowa strona...</p>",
      });

      setPages((prev) => [...prev, res as any]);
    }

    setCreateModalOpen(false);
    setCreateType(null);
    setCreateCategory("");
    setCreateSubcategory("");
    setCreateLabel("");
  }

  /* ---------------- EDIT PAGE ---------------- */

  function selectPage(page: GamePage) {
    setActiveId(page.id);
    setDraftPage(null);
    setIsEditing(false);
  }

  function startEdit() {
    if (!activePage) return;
    setDraftPage({ ...activePage });
    setIsEditing(true);
  }

  function updateDraft(field: keyof GamePage, value: any) {
    if (!draftPage) return;
    setDraftPage({ ...draftPage, [field]: value });
  }

  async function handleSave() {
    if (!draftPage) return;

    await updatePage(draftPage.id, {
      label: draftPage.label,
      category: draftPage.category,
      subcategory: draftPage.subcategory,
      content: draftPage.content,
    });

    setPages((prev) =>
      prev.map((p) => (p.id === draftPage.id ? draftPage : p))
    );

    setIsEditing(false);
    setDraftPage(null);
  }

  async function handleDeletePage(pageId: string) {
    if (!confirm("Usunąć stronę?")) return;

    await deletePage(pageId);

    setPages((prev) => prev.filter((p) => p.id !== pageId));
  }

  const current = isEditing ? draftPage : activePage;

  /* ---------------- UI ---------------- */

  return (
    <div className="h-screen flex flex-col bg-[#050509] text-neutral-200">
      {/* TOP BAR */}
      <div className="flex justify-between items-center px-6 py-3 border-b border-white/10 bg-[#0d0d10]">
        <h1 className="text-lg tracking-[0.25em] uppercase font-semibold">
          {game.name} Codex
        </h1>

        <div className="text-xs text-neutral-500">
          {pages.length} pages
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <div className="w-80 border-r border-white/10 p-4 overflow-y-auto">
          {/* CATEGORY HEADER */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs uppercase tracking-wider text-neutral-400">
              Categories
            </h2>

            {isAdmin && (
              <button
                onClick={() => openCreate("category")}
                className="text-xs px-2 py-1 bg-[#1a1a22] rounded hover:bg-[#222]"
              >
                + Add
              </button>
            )}
          </div>

          {/* CATEGORY LIST */}
          {categories.map((cat) => (
            <div
              key={cat}
              className="mb-4 border border-white/5 rounded-lg p-3 bg-[#0b0b10]"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium">{cat}</div>

                {isAdmin && (
                  <div className="flex gap-2 text-xs">
                    <button onClick={() => {
                      const newName = prompt("Rename category:", cat);
                      if (!newName) return;

                      setCategories((prev) =>
                        prev.map((c) => (c === cat ? newName : c))
                      );
                    }}>
                      rename
                    </button>

                    <button
                      onClick={() => {
                        setCreateCategory(cat);
                        openCreate("subcategory");
                      }}
                    >
                      + sub
                    </button>
                  </div>
                )}
              </div>

              {/* SUBCATEGORIES */}
              <div className="ml-2 border-l border-white/10 pl-3 space-y-3">
                {(subcategories[cat] || []).map((sub) => (
                  <div key={sub}>
                    <div className="flex justify-between text-xs text-neutral-400 mb-1">
                      <span>{sub}</span>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            const newName = prompt("Rename subcategory:", sub);
                            if (!newName) return;

                            setSubcategories((prev) => {
                              const updated = { ...prev };
                              updated[cat] = updated[cat].map((s) =>
                                s === sub ? newName : s
                              );
                              return updated;
                            });
                          }}
                        >
                          rename
                        </button>
                      )}
                    </div>

                    <div className="ml-2 space-y-1">
                      {pages
                        .filter(
                          (p) =>
                            p.category === cat &&
                            p.subcategory === sub
                        )
                        .map((page) => (
                          <div key={page.id} className="flex justify-between">
                            <button
                              onClick={() => selectPage(page)}
                              className="text-xs text-neutral-400 hover:text-white"
                            >
                              {page.label}
                            </button>

                            {isAdmin && (
                              <div className="flex gap-1 text-xs">
                                <button
                                  onClick={() => {
                                    const newName = prompt(
                                      "Rename page:",
                                      page.label
                                    );
                                    if (!newName) return;

                                    updatePage(page.id, {
                                      label: newName,
                                    });

                                    setPages((prev) =>
                                      prev.map((p) =>
                                        p.id === page.id
                                          ? { ...p, label: newName }
                                          : p
                                      )
                                    );
                                  }}
                                >
                                  rename
                                </button>

                                <button
                                  onClick={() =>
                                    handleDeletePage(page.id)
                                  }
                                  className="text-red-500"
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </div>
                        ))}

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setCreateCategory(cat);
                            setCreateSubcategory(sub);
                            openCreate("page");
                          }}
                          className="text-[11px] text-neutral-500 hover:text-white"
                        >
                          + page
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto">
          {current ? (
            <div className="max-w-4xl">
              {/* HEADER TOOLBAR */}
              <div className="flex justify-between items-center mb-4">
                {isEditing && draftPage ? (
                  <input
                    value={draftPage.label}
                    onChange={(e) =>
                      updateDraft("label", e.target.value)
                    }
                    className="text-2xl bg-transparent border-b outline-none w-full"
                  />
                ) : (
                  <h2 className="text-2xl font-semibold">
                    {current.label}
                  </h2>
                )}

                <div className="flex gap-2">
                  {!isEditing && isAdmin && (
                    <button
                      onClick={startEdit}
                      className="px-3 py-1 text-xs bg-blue-600 rounded"
                    >
                      Edit
                    </button>
                  )}

                  {isEditing && (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setDraftPage(null);
                        }}
                        className="px-3 py-1 text-xs bg-gray-600 rounded"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handleSave}
                        className="px-3 py-1 text-xs bg-green-600 rounded"
                      >
                        Save
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* META */}
              <div className="text-xs text-neutral-500 mb-4 flex gap-4">
                <span>{current.category}</span>
                <span>{current.subcategory}</span>
              </div>

              {/* CONTENT */}
              <div className="prose prose-invert max-w-none">
                {isEditing && draftPage ? (
                  <TiptapEditor
                    value={
                      typeof draftPage.content === "string"
                        ? draftPage.content
                        : ""
                    }
                    onChange={(val) =>
                      updateDraft("content", val as any)
                    }
                  />
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        typeof current.content === "string"
                          ? current.content
                          : "",
                    }}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="text-neutral-500">
              Select a page
            </div>
          )}
        </div>
      </div>

      {/* CREATE MODAL */}
      <Modal
        open={createModalOpen}
        title={
          createType === "category"
            ? "Create Category"
            : createType === "subcategory"
            ? "Create Subcategory"
            : "Create Page"
        }
        onClose={() => setCreateModalOpen(false)}
      >
        <div className="space-y-3">
          {createType === "category" && (
            <input
              placeholder="Category name"
              value={createCategory}
              onChange={(e) => setCreateCategory(e.target.value)}
              className="w-full px-3 py-2 bg-black/40 rounded border border-white/10"
            />
          )}

          {createType === "subcategory" && (
            <>
              <div className="text-xs text-neutral-500">
                Category: {createCategory}
              </div>
              <input
                placeholder="Subcategory name"
                value={createSubcategory}
                onChange={(e) =>
                  setCreateSubcategory(e.target.value)
                }
                className="w-full px-3 py-2 bg-black/40 rounded border border-white/10"
              />
            </>
          )}

          {createType === "page" && (
            <>
              <div className="text-xs text-neutral-500">
                {createCategory} / {createSubcategory}
              </div>
              <input
                placeholder="Page title"
                value={createLabel}
                onChange={(e) => setCreateLabel(e.target.value)}
                className="w-full px-3 py-2 bg-black/40 rounded border border-white/10"
              />
            </>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="px-3 py-1 text-xs bg-gray-600 rounded"
            >
              Cancel
            </button>

            <button
              onClick={handleCreate}
              className="px-3 py-1 text-xs bg-green-600 rounded"
            >
              Create
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}