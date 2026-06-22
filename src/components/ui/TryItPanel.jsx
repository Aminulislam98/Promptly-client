"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Copy, Check, Zap, ChevronDown, ChevronUp } from "lucide-react";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2";

// Detect [VARIABLE], {{variable}}, or <variable> placeholders
function extractVars(content = "") {
  const patterns = [
    /\[([A-Z][A-Z0-9 _]{0,40})\]/g,      // [TOPIC], [YOUR NAME]
    /\{\{([a-z][a-z0-9_]{0,40})\}\}/g,   // {{topic}}, {{your_name}}
    /<([A-Z][A-Z0-9 _]{0,40})>/g,         // <TOPIC>
  ];
  const found = new Map();
  for (const re of patterns) {
    let m;
    while ((m = re.exec(content)) !== null) {
      const key = m[1].trim();
      if (!found.has(key)) found.set(key, { key, raw: m[0] });
    }
  }
  return [...found.values()];
}

// Escape any regex special chars in the key so they match literally
function escRe(str) { return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function fillContent(content = "", values = {}) {
  let result = content;
  for (const [key, val] of Object.entries(values)) {
    const safeKey = escRe(key);
    const safeKeyLower = escRe(key.toLowerCase().replace(/ /g, "_"));
    result = result
      .replace(new RegExp(`\\[${safeKey}\\]`, "g"), val || `[${key}]`)
      .replace(new RegExp(`\\{\\{${safeKeyLower}\\}\\}`, "g"), val || `{{${key.toLowerCase().replace(/ /g, "_")}}}`)
      .replace(new RegExp(`<${safeKey}>`, "g"), val || `<${key}>`);
  }
  return result;
}

export function TryItPanel({ content = "", isLocked = false }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({});
  const [copied, setCopied] = useState(false);

  const vars = extractVars(content);
  const hasVars = vars.length > 0;
  const filled = fillContent(content, values);

  // Reset when content changes
  useEffect(() => setValues({}), [content]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(filled);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* */ }
  }, [filled]);

  if (isLocked) return null;

  return (
    <div className="rounded-xl border border-brand/30 bg-brand-light">
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={
          "flex w-full items-center justify-between gap-3 px-5 py-4 text-left " + focusRing
        }
      >
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 shrink-0 text-brand" />
          <span className="text-base font-semibold text-brand">Try It</span>
          {hasVars && (
            <span className="rounded-full bg-brand px-2 py-0.5 text-sm font-semibold text-white">
              {vars.length} variable{vars.length !== 1 ? "s" : ""}
            </span>
          )}
          {!hasVars && (
            <span className="text-base text-brand/70">— fill in variables and copy</span>
          )}
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-brand" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-brand" />
        )}
      </button>

      {open && (
        <div className="border-t border-brand/20 px-5 pb-5 pt-4">
          {/* Variable inputs */}
          {hasVars ? (
            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {vars.map(({ key }) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-text-secondary">
                    {key}
                  </label>
                  <input
                    type="text"
                    value={values[key] || ""}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    placeholder={`Enter ${key.toLowerCase()}…`}
                    className={
                      "h-10 w-full rounded-lg border bg-surface px-3 text-base text-text-primary placeholder:text-text-muted transition-colors focus:border-brand " +
                      focusRing
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="mb-4 text-base text-text-secondary">
              No variables detected. You can copy the prompt as-is below.
            </p>
          )}

          {/* Live preview */}
          <div className="relative">
            <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg border bg-surface p-4 font-mono text-base leading-relaxed text-text-primary">
              {filled}
            </pre>
            <button
              type="button"
              onClick={handleCopy}
              className={
                "absolute right-3 top-3 inline-flex h-8 items-center gap-1.5 rounded-md border bg-surface px-3 text-base font-medium transition-colors hover:bg-surface-hover " +
                (copied ? "border-success text-success" : "text-text-secondary") +
                " " + focusRing
              }
            >
              {copied ? (
                <><Check className="h-3.5 w-3.5" /> Copied</>
              ) : (
                <><Copy className="h-3.5 w-3.5" /> Copy</>
              )}
            </button>
          </div>

          {hasVars && (
            <p className="mt-3 text-base text-text-muted">
              Fill in the fields above — the preview updates live.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
