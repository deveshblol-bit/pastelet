"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="px-4 py-2 text-sm border border-[#E5E5E5] rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
    >
      {copied ? "Copied!" : "Copy text"}
    </button>
  );
}
