import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { storePaste } from "@/lib/kv";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = body?.text;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (Buffer.byteLength(text, "utf-8") > 500 * 1024) {
      return NextResponse.json({ error: "Text exceeds 500KB limit" }, { status: 413 });
    }

    const id = nanoid(8);
    const { expiresAt } = await storePaste(id, text);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null)
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
      || "http://localhost:3000";

    return NextResponse.json({
      id,
      url: `${baseUrl}/p/${id}`,
      rawUrl: `${baseUrl}/raw/${id}`,
      expiresAt,
      expiresIn: "15 minutes",
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal error" }, { status: 500 });
  }
}
