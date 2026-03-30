import { kv } from "@vercel/kv";

const TTL_SECONDS = 900; // 15 minutes
const MAX_SIZE = 500 * 1024; // 500KB

export async function storePaste(id: string, text: string): Promise<{ expiresAt: number }> {
  if (Buffer.byteLength(text, "utf-8") > MAX_SIZE) {
    throw new Error("Text exceeds 500KB limit");
  }
  const expiresAt = Date.now() + TTL_SECONDS * 1000;
  await kv.set(`paste:${id}`, JSON.stringify({ text, expiresAt }), { ex: TTL_SECONDS });
  return { expiresAt };
}

export async function getPaste(id: string): Promise<{ text: string; expiresAt: number } | null> {
  const raw = await kv.get<string>(`paste:${id}`);
  if (!raw) return null;
  const data = typeof raw === "string" ? JSON.parse(raw) : raw;
  return { text: data.text, expiresAt: data.expiresAt };
}
