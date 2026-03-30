import { NextResponse } from "next/server";
import { getPaste } from "@/lib/kv";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const paste = await getPaste(id);

  if (!paste) {
    return NextResponse.json({ error: "Paste not found or expired" }, { status: 404 });
  }

  return NextResponse.json(paste);
}
