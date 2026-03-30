import { getPaste } from "@/lib/kv";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const paste = await getPaste(id);

  if (!paste) {
    return new Response("Paste not found or expired", { status: 404, headers: { "Content-Type": "text/plain" } });
  }

  return new Response(paste.text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
