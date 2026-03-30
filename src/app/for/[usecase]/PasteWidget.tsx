"use client";

import { useState } from "react";

export default function PasteWidget() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ url: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleCreate() {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/paste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (result) {
    return (
      <div className="p-5 rounded-xl border border-gray-200 bg-gray-50/30 animate-fade-in">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">Your link</p>
        <div className="flex items-center gap-3">
          <code className="flex-1 text-sm font-mono bg-white px-4 py-3 rounded-lg border border-gray-100 truncate">
            {result.url}
          </code>
          <button onClick={handleCopy} className="px-4 py-3 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-all">
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 font-light">Expires in 15 minutes</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here..."
        className="w-full h-40 p-4 rounded-xl border border-gray-200 bg-gray-50/50 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all placeholder:text-gray-300"
      />
      <div className="flex justify-end">
        <button
          onClick={handleCreate}
          disabled={!text.trim() || loading}
          className="px-5 py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-hover disabled:opacity-40 transition-all"
        >
          {loading ? "Creating..." : "Create Paste"}
        </button>
      </div>
    </div>
  );
}
