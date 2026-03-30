import type { MetadataRoute } from "next";

const useCases = [
  "telegram", "discord", "ai-agents", "chatgpt", "claude",
  "whatsapp", "slack", "code-review", "meeting-notes", "error-logs",
  "self-destructing", "twitter", "reddit", "gemini",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://pastelet.vercel.app";

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    ...useCases.map((uc) => ({
      url: `${base}/for/${uc}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
