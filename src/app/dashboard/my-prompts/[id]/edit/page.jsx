"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { getPromptById, updatePrompt } from "@/lib/api";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

const CATEGORIES = [
  "Marketing",
  "Coding",
  "Writing",
  "Business",
  "Design",
  "Education",
  "Productivity",
];
const AI_TOOLS = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Midjourney",
  "DALL-E",
  "Stable Diffusion",
];
const DIFFICULTIES = ["Beginner", "Intermediate", "Pro"];

export default function EditPromptPage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    category: "Coding",
    aiTool: "ChatGPT",
    tags: "",
    difficulty: "Beginner",
    visibility: "Public",
    usageInstructions: "",
  });

  useEffect(() => {
    if (!id) return;
    getPromptById(id)
      .then((data) => {
        const p = data.prompt;
        setForm({
          title: p.title || "",
          description: p.description || "",
          content: p.content || "",
          category: p.category || "Coding",
          aiTool: p.aiTool || "ChatGPT",
          tags: Array.isArray(p.tags) ? p.tags.join(", ") : p.tags || "",
          difficulty: p.difficulty || "Beginner",
          visibility: p.visibility || "Public",
          usageInstructions: p.usageInstructions || "",
        });
      })
      .catch(() => toast.error("Failed to load prompt"))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.content.trim()) {
      toast.error("Prompt content is required");
      return;
    }

    setIsSaving(true);
    try {
      const tags = form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      await updatePrompt(id, { ...form, tags });
      toast.success("Prompt updated!");
      setTimeout(() => router.push("/dashboard/my-prompts"), 1000);
    } catch (err) {
      toast.error(err.message || "Failed to update prompt");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 w-48 animate-pulse rounded bg-surface-hover" />
        <div className="h-64 animate-pulse rounded-xl bg-surface-hover" />
      </div>
    );
  }

  return (
    <section>
      <Toaster position="top-center" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          Edit Prompt
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          Update your prompt details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="title"
            className="text-base font-medium text-text-primary"
          >
            Prompt Title <span className="text-error">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter prompt title"
            className={
              "h-11 w-full rounded-lg border bg-surface px-4 text-base text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-brand " +
              focusRing
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="description"
            className="text-base font-medium text-text-primary"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="Describe what this prompt does"
            className={
              "w-full rounded-lg border bg-surface px-4 py-3 text-base text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-brand resize-none " +
              focusRing
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="content"
            className="text-base font-medium text-text-primary"
          >
            Prompt Content <span className="text-error">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            rows={6}
            value={form.content}
            onChange={handleChange}
            placeholder="Write your prompt here..."
            className={
              "w-full rounded-lg border bg-surface px-4 py-3 text-base text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-brand resize-none font-mono " +
              focusRing
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="category"
              className="text-base font-medium text-text-primary"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className={
                "h-11 w-full rounded-lg border bg-surface px-4 text-base text-text-primary outline-none focus:ring-2 focus:ring-brand " +
                focusRing
              }
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="aiTool"
              className="text-base font-medium text-text-primary"
            >
              AI Tool
            </label>
            <select
              id="aiTool"
              name="aiTool"
              value={form.aiTool}
              onChange={handleChange}
              className={
                "h-11 w-full rounded-lg border bg-surface px-4 text-base text-text-primary outline-none focus:ring-2 focus:ring-brand " +
                focusRing
              }
            >
              {AI_TOOLS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="difficulty"
              className="text-base font-medium text-text-primary"
            >
              Difficulty Level
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className={
                "h-11 w-full rounded-lg border bg-surface px-4 text-base text-text-primary outline-none focus:ring-2 focus:ring-brand " +
                focusRing
              }
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="visibility"
              className="text-base font-medium text-text-primary"
            >
              Visibility
            </label>
            <select
              id="visibility"
              name="visibility"
              value={form.visibility}
              onChange={handleChange}
              className={
                "h-11 w-full rounded-lg border bg-surface px-4 text-base text-text-primary outline-none focus:ring-2 focus:ring-brand " +
                focusRing
              }
            >
              <option value="Public">Public</option>
              <option value="Private">Private (Premium)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="tags"
            className="text-base font-medium text-text-primary"
          >
            Tags
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={form.tags}
            onChange={handleChange}
            placeholder="e.g. marketing, seo, copywriting (comma separated)"
            className={
              "h-11 w-full rounded-lg border bg-surface px-4 text-base text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-brand " +
              focusRing
            }
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="usageInstructions"
            className="text-base font-medium text-text-primary"
          >
            Usage Instructions
          </label>
          <textarea
            id="usageInstructions"
            name="usageInstructions"
            rows={3}
            value={form.usageInstructions}
            onChange={handleChange}
            placeholder="How to use this prompt effectively..."
            className={
              "w-full rounded-lg border bg-surface px-4 py-3 text-base text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-brand resize-none " +
              focusRing
            }
          />
        </div>

        <div className="flex items-center gap-3 border-t pt-5">
          <button
            type="submit"
            disabled={isSaving}
            className={
              "inline-flex h-11 items-center justify-center rounded-lg bg-brand px-6 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] disabled:opacity-60 " +
              focusRing
            }
          >
            {isSaving ? "Saving…" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard/my-prompts")}
            className={
              "inline-flex h-11 items-center justify-center rounded-lg border px-6 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover " +
              focusRing
            }
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
