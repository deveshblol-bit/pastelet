"use client";

import { useState, useEffect } from "react";

export default function Countdown({ expiresAt }: { expiresAt: number }) {
  const [remaining, setRemaining] = useState(Math.max(0, expiresAt - Date.now()));

  useEffect(() => {
    const timer = setInterval(() => {
      const r = Math.max(0, expiresAt - Date.now());
      setRemaining(r);
      if (r <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  if (remaining <= 0) {
    return <span className="text-red-400">Expired</span>;
  }

  return (
    <span className="tabular-nums">
      {minutes}:{seconds.toString().padStart(2, "0")}
    </span>
  );
}
