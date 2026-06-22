"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FolderOpen, Plus, Trash2, ArrowRight, FolderPlus } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getCollections, createCollection, deleteCollection } from "@/lib/api";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    getCollections()
      .then((d) => setCollections(d.collections || []))
      .catch(() => toast.error("Failed to load collections"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      const data = await createCollection(name.trim());
      setCollections((prev) => [data.collection, ...prev]);
      setName("");
      toast.success("Collection created");
    } catch (err) {
      toast.error(err.message || "Failed to create collection");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteCollection(id);
      setCollections((prev) => prev.filter((c) => String(c._id) !== id));
      toast.success("Collection deleted");
    } catch {
      toast.error("Failed to delete collection");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section>
      <Toaster position="top-center" />
      <div className="mb-6">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">Collections</h1>
        <p className="mt-1 text-base text-text-secondary">Organise your saved prompts into named folders.</p>
      </div>

      {/* Create form */}
      <form onSubmit={handleCreate} className="mb-6 flex gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New collection name…"
          className={"flex-1 h-11 rounded-lg border bg-surface px-4 text-base text-text-primary placeholder:text-text-muted focus:border-brand outline-none " + focusRing}
        />
        <button
          type="submit"
          disabled={creating || !name.trim()}
          className={"inline-flex h-11 items-center gap-2 rounded-lg bg-brand px-5 text-base font-semibold text-white transition-all hover:bg-brand-hover disabled:opacity-50 " + focusRing}
        >
          <Plus className="h-4 w-4" />
          {creating ? "Creating…" : "Create"}
        </button>
      </form>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl border bg-surface" />
          ))}
        </div>
      ) : collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-surface py-16 text-center">
          <FolderPlus className="h-10 w-10 text-text-secondary" />
          <p className="mt-4 text-base font-semibold text-text-primary">No collections yet</p>
          <p className="mt-1 text-base text-text-secondary">Create one above and save prompts to it from any prompt page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => (
            <div key={String(col._id)} className="group relative flex flex-col rounded-xl border bg-surface p-5 transition-colors hover:border-brand">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-light">
                    <FolderOpen className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-text-primary">{col.name}</p>
                    <p className="text-base text-text-muted">
                      {(col.promptIds || []).length} prompt{(col.promptIds || []).length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(String(col._id))}
                  disabled={deletingId === String(col._id)}
                  className={"rounded-lg p-1.5 text-text-muted transition-colors hover:text-error disabled:opacity-50 " + focusRing}
                  aria-label="Delete collection"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-sm text-text-muted">
                Created {new Date(col.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
