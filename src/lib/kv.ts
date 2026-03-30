const TTL_SECONDS = 900; // 15 minutes
const MAX_SIZE = 500 * 1024; // 500KB

// Use Upstash Redis REST API if available, otherwise in-memory (dev/demo)
const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

async function redisCmd(...args: string[]): Promise<any> {
  if (!KV_URL || !KV_TOKEN) return null; // fallback signals
  const res = await fetch(`${KV_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });
  const data = await res.json();
  return data.result;
}

// In-memory fallback for when no Redis is configured
const memStore = new Map<string, { text: string; expiresAt: number }>();

function cleanExpired() {
  const now = Date.now();
  for (const [k, v] of memStore) {
    if (v.expiresAt <= now) memStore.delete(k);
  }
}

export async function storePaste(id: string, text: string): Promise<{ expiresAt: number }> {
  if (Buffer.byteLength(text, "utf-8") > MAX_SIZE) {
    throw new Error("Text exceeds 500KB limit");
  }
  const expiresAt = Date.now() + TTL_SECONDS * 1000;
  const payload = JSON.stringify({ text, expiresAt });

  if (KV_URL && KV_TOKEN) {
    await redisCmd("SET", `paste:${id}`, payload, "EX", String(TTL_SECONDS));
  } else {
    memStore.set(id, { text, expiresAt });
    setTimeout(() => memStore.delete(id), TTL_SECONDS * 1000);
  }

  return { expiresAt };
}

export async function getPaste(id: string): Promise<{ text: string; expiresAt: number } | null> {
  if (KV_URL && KV_TOKEN) {
    const raw = await redisCmd("GET", `paste:${id}`);
    if (!raw) return null;
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    return { text: data.text, expiresAt: data.expiresAt };
  } else {
    cleanExpired();
    const entry = memStore.get(id);
    if (!entry || entry.expiresAt <= Date.now()) return null;
    return entry;
  }
}
