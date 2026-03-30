"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ViewPaste() {
  const { id } = useParams<{ id: string }>();
  const [text, setText] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number>(0);
  const [remaining, setRemaining] = useState("");
  const [expired, setExpired] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/paste/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data) => {
        setText(data.text);
        setExpiresAt(data.expiresAt);
      })
      .catch(() => setNotFound(true));
  }, [id]);

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const diff = expiresAt - Date.now();
      if (diff <= 0) {
        setExpired(true);
        setRemaining("0:00");
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setRemaining(`${mins}:${secs.toString().padStart(2, "0")}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  function handleCopy() {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (notFound) {
    return (
      <main className="max-w-2xl mx-auto px-6 pt-24 pb-16 animate-fade-in">
        <h1 className="text-3xl font-semibold tracking-tight mb-3">Not Found</h1>
        <p className="text-gray-500 font-light mb-6">
          This paste has expired or doesn't exist.
        </p>
        <a href="/" className="text-sm text-accent hover:text-accent-hover transition-colors">
          ← Create a new paste
        </a>
      </main>
    );
  }

  if (text === null) {
    return (
      <main className="max-w-2xl mx-auto px-6 pt-24 pb-16">
        <div className="h-64 bg-gray-50 rounded-xl animate-pulse-soft" />
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 pt-24 pb-16 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pastelet</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className={`text-sm font-mono ${expired ? "text-red-500" : "text-gray-400"}`}>
            {expired ? "Expired" : remaining}
          </span>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-all"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <div className="p-5 rounded-xl border border-gray-200 bg-gray-50/30 min-h-[200px]">
        <pre className="font-mono text-sm whitespace-pre-wrap break-words text-[#111] leading-relaxed">
          {text}
        </pre>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <a href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors font-light">
          ← Create a new paste
        </a>
        <a
          href={`/raw/${id}`}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors font-light"
        >
          View raw
        </a>
      </div>
    </main>
  );
}
