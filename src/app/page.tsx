"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ url: string; rawUrl: string; id: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const byteSize = new Blob([text]).size;
  const overLimit = byteSize > 500 * 1024;

  async function handleCreate() {
    if (!text.trim() || overLimit) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/paste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      setError(e.message);
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

  function handleReset() {
    setText("");
    setResult(null);
    setError("");
  }

  return (
    <main className="max-w-2xl mx-auto px-6 pt-24 pb-16 animate-fade-in">
      <div className="mb-12">
        <h1 className="text-4xl font-semibold tracking-tight mb-3">Pastelet</h1>
        <p className="text-lg text-gray-500 font-light">
          Share text that disappears in 15 minutes.
        </p>
      </div>

      {!result ? (
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here..."
            className="w-full h-64 p-5 rounded-xl border border-gray-200 bg-gray-50/50 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all placeholder:text-gray-300"
            autoFocus
          />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-light ${overLimit ? "text-red-500" : "text-gray-400"}`}>
              {(byteSize / 1024).toFixed(1)} KB / 500 KB
            </span>
            <button
              onClick={handleCreate}
              disabled={!text.trim() || loading || overLimit}
              className="px-6 py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Creating..." : "Create Paste"}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-xl border border-gray-200 bg-gray-50/30">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">Your link</p>
            <div className="flex items-center gap-3">
              <code className="flex-1 text-sm font-mono text-[#111] bg-white px-4 py-3 rounded-lg border border-gray-100 truncate">
                {result.url}
              </code>
              <button
                onClick={handleCopy}
                className="px-5 py-3 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-all shrink-0"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3 font-light">
              Expires in 15 minutes · Raw: <a href={result.rawUrl} className="underline hover:text-gray-600">/raw/{result.id}</a>
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors font-light"
          >
            ← Create another
          </button>
        </div>
      )}
    </main>
  );
}
