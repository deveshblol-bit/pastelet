"use client";

import { useState } from "react";

export default function PasteForm() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ url: string; id: string } | null>(null);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    if (new Blob([text]).size > 500 * 1024) {
      setError("Text exceeds 500KB limit");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/paste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create paste");
      }
      const data = await res.json();
      setResult({ url: data.url, id: data.id });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (result) {
      navigator.clipboard.writeText(result.url);
      showToast("Link copied!");
    }
  };

  if (result) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="rounded-xl border border-[#E5E5E5] p-6 bg-[#FAFAFA]">
          <p className="text-sm text-gray-500 mb-2">Your paste is live for 15 minutes</p>
          <a href={`/p/${result.id}`} className="text-[#111] font-medium text-lg break-all hover:text-[var(--color-coral)] transition-colors">
            {result.url}
          </a>
        </div>
        <div className="flex gap-3">
          <button onClick={copyLink} className="px-6 py-3 bg-[var(--color-coral)] text-white rounded-lg font-medium hover:bg-[var(--color-coral-hover)] transition-colors">
            Copy Link
          </button>
          <button onClick={() => { setResult(null); setText(""); }} className="px-6 py-3 border border-[#E5E5E5] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            New Paste
          </button>
        </div>
        {toast && (
          <div className="animate-toast fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#111] text-white px-5 py-2.5 rounded-lg text-sm shadow-lg">
            {toast}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here..."
        className="w-full h-64 p-5 rounded-xl border border-[#E5E5E5] bg-white text-[#111] text-base font-mono resize-none focus:outline-none focus:border-[#CCC] transition-colors placeholder:text-gray-300"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={loading || !text.trim()}
        className="px-8 py-3.5 bg-[var(--color-coral)] text-white rounded-lg font-medium text-base hover:bg-[var(--color-coral-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : "Create Paste"}
      </button>
      <p className="text-sm text-gray-400">Plaintext only · Max 500KB · Auto-deletes in 15 minutes</p>
    </div>
  );
}
