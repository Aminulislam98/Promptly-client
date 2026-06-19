"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { addPrompt } from "@/lib/api";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

const inputBase =
  "w-full rounded-lg border-0 bg-surface-hover px-4 text-base text-text-primary placeholder:text-text-muted outline-none ring-1 ring-border transition-all duration-150 focus:ring-2 focus:ring-brand h-12";

const labelClass = "text-base font-medium text-text-primary";

const CATEGORIES = [
  "Productivity",
  "Coding",
  "Writing",
  "Marketing",
  "Design",
  "Education",
  "Business",
  "Other",
];
const AI_TOOLS = [
  "ChatGPT",
  "Gemini",
  "Claude",
  "Midjourney",
  "DALL-E",
  "Stable Diffusion",
  "Other",
];
const DIFFICULTIES = ["Beginner", "Intermediate", "Pro"];

export default function AddPromptPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    aiTool: "",
    tags: "",
    difficulty: "",
    visibility: "Public",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setPreview(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.content.trim())
      newErrors.content = "Prompt content is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.aiTool) newErrors.aiTool = "AI Tool is required";
    if (!formData.difficulty) newErrors.difficulty = "Difficulty is required";
    return newErrors;
  };

  const uploadThumbnail = async (file) => {
    const data = new FormData();
    data.append("image", file);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_KEY}`,
      { method: "POST", body: data },
    );
    const json = await res.json();
    return json.data?.url || "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      let thumbnailUrl = "";
      if (thumbnail) {
        thumbnailUrl = await uploadThumbnail(thumbnail);
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        aiTool: formData.aiTool,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        difficulty: formData.difficulty,
        visibility: formData.visibility,
        thumbnail: thumbnailUrl,
        copyCount: 0,
        status: "pending",
      };

      await addPrompt(payload);
      toast.success("Prompt submitted for review!");
      setTimeout(() => router.push("/dashboard/my-prompts"), 1500);
    } catch (err) {
      toast.error(err.message || "Failed to submit prompt");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <Toaster position="top-center" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold leading-tight text-text-primary">
          Add Prompt
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          Your prompt will be reviewed by admin before going live.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        {/* Basic Info */}
        <div className="rounded-xl border bg-surface px-6 py-6">
          <h2 className="mb-5 text-xl font-semibold text-text-primary">
            Basic Info
          </h2>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="title" className={labelClass}>
                Prompt Title <span className="text-error">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Write a killer cold email"
                className={inputBase + (errors.title ? " ring-error" : "")}
              />
              {errors.title && (
                <p className="text-base text-error">{errors.title}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="description" className={labelClass}>
                Description <span className="text-error">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe what this prompt does"
                className={
                  "w-full rounded-lg border-0 bg-surface-hover px-4 py-3 text-base text-text-primary placeholder:text-text-muted outline-none ring-1 ring-border transition-all duration-150 focus:ring-2 focus:ring-brand resize-none " +
                  (errors.description ? "ring-error" : "")
                }
              />
              {errors.description && (
                <p className="text-base text-error">{errors.description}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="content" className={labelClass}>
                Prompt Content <span className="text-error">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                rows={8}
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your full prompt here..."
                className={
                  "w-full rounded-lg border-0 bg-surface-hover px-4 py-3 text-base text-text-primary placeholder:text-text-muted outline-none ring-1 ring-border transition-all duration-150 focus:ring-2 focus:ring-brand resize-none font-mono " +
                  (errors.content ? "ring-error" : "")
                }
              />
              {errors.content && (
                <p className="text-base text-error">{errors.content}</p>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="rounded-xl border bg-surface px-6 py-6">
          <h2 className="mb-5 text-xl font-semibold text-text-primary">
            Details
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="category" className={labelClass}>
                Category <span className="text-error">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={
                  inputBase +
                  " cursor-pointer " +
                  (errors.category ? "ring-error" : "")
                }
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-base text-error">{errors.category}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="aiTool" className={labelClass}>
                AI Tool <span className="text-error">*</span>
              </label>
              <select
                id="aiTool"
                name="aiTool"
                value={formData.aiTool}
                onChange={handleChange}
                className={
                  inputBase +
                  " cursor-pointer " +
                  (errors.aiTool ? "ring-error" : "")
                }
              >
                <option value="">Select AI tool</option>
                {AI_TOOLS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.aiTool && (
                <p className="text-base text-error">{errors.aiTool}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="difficulty" className={labelClass}>
                Difficulty <span className="text-error">*</span>
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className={
                  inputBase +
                  " cursor-pointer " +
                  (errors.difficulty ? "ring-error" : "")
                }
              >
                <option value="">Select difficulty</option>
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {errors.difficulty && (
                <p className="text-base text-error">{errors.difficulty}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="visibility" className={labelClass}>
                Visibility
              </label>
              <select
                id="visibility"
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className={inputBase + " cursor-pointer"}
              >
                <option value="Public">Public</option>
                <option value="Private">Private (Premium)</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <label htmlFor="tags" className={labelClass}>
                Tags{" "}
                <span className="text-base font-normal text-text-secondary">
                  (comma separated)
                </span>
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. email, sales, copywriting"
                className={inputBase}
              />
            </div>
          </div>
        </div>

        {/* Thumbnail */}
        <div className="rounded-xl border bg-surface px-6 py-6">
          <h2 className="mb-5 text-xl font-semibold text-text-primary">
            Thumbnail
          </h2>
          {preview ? (
            <div className="relative w-fit">
              <img
                src={preview}
                alt="Thumbnail preview"
                className="h-40 w-64 rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={removeThumbnail}
                aria-label="Remove thumbnail"
                className={
                  "absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-error text-on-brand transition-opacity hover:opacity-80 " +
                  focusRing
                }
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="thumbnail"
              className={
                "flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-surface-hover transition-colors duration-150 hover:border-brand hover:bg-brand-light " +
                focusRing
              }
            >
              <Upload className="h-6 w-6 text-text-secondary" />
              <span className="text-base font-medium text-text-secondary">
                Click to upload thumbnail
              </span>
              <span className="text-base text-text-muted">
                PNG, JPG up to 2MB
              </span>
              <input
                id="thumbnail"
                name="thumbnail"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleThumbnail}
              />
            </label>
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className={
              "inline-flex h-11 items-center justify-center rounded-lg border px-6 text-base font-medium text-text-primary transition-colors hover:bg-surface-hover active:scale-[0.98] " +
              focusRing
            }
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={
              "inline-flex h-11 items-center justify-center rounded-lg bg-brand px-6 text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] disabled:opacity-60 " +
              focusRing
            }
          >
            {isLoading ? "Submitting…" : "Submit for Review"}
          </button>
        </div>
      </form>
    </section>
  );
}
