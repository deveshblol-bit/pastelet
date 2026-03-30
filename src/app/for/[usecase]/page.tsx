import PasteForm from "@/components/PasteForm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const pages: Record<string, { title: string; heading: string; description: string; content: string[] }> = {
  telegram: {
    title: "Share Long Text on Telegram — Pastelet",
    heading: "Share long text on Telegram",
    description: "Telegram has a 4096 character limit for messages. Pastelet lets you share longer text instantly.",
    content: [
      "Telegram limits messages to 4,096 characters. When you need to share a long note, code snippet, or document, that's not enough.",
      "Pastelet creates an instant, shareable link for your text. Paste your content, get a link, and send it in Telegram. The recipient sees your full text in a clean, readable format.",
      "Your paste auto-deletes after 15 minutes — perfect for ephemeral sharing without leaving a trace.",
    ],
  },
  discord: {
    title: "Bypass Discord Character Limits — Pastelet",
    heading: "Bypass Discord character limits",
    description: "Discord limits messages to 2000 characters. Share longer text with a Pastelet link.",
    content: [
      "Discord's 2,000 character limit can be frustrating when sharing code, logs, or long messages.",
      "Instead of splitting your message into multiple parts, paste it into Pastelet and share the link. Your text is displayed in a clean, monospace format — perfect for code and logs.",
      "Links are ephemeral. After 15 minutes, the paste disappears. No clutter, no permanence.",
    ],
  },
  "ai-agents": {
    title: "Share Context with AI Agents — Pastelet",
    heading: "Share context with AI agents",
    description: "Give AI agents access to long text via a simple URL they can fetch.",
    content: [
      "AI agents often need to read long documents, prompts, or context. Most chat interfaces have input limits.",
      "Pastelet provides a /raw/ endpoint that returns plain text — perfect for agents to fetch programmatically. Just create a paste and share the raw URL.",
      "No authentication required. The agent fetches the URL, gets the text, and you're done. The paste expires after 15 minutes for security.",
    ],
  },
  chatgpt: {
    title: "Share Long Prompts with ChatGPT — Pastelet",
    heading: "Share long prompts with ChatGPT",
    description: "Create shareable links for long ChatGPT prompts and conversations.",
    content: [
      "Sharing long ChatGPT prompts with colleagues or on social media is awkward. The text is too long for a message, and screenshots lose formatting.",
      "Pastelet gives you a clean, shareable link. Paste your prompt, share the link, and anyone can read it in a beautifully formatted view.",
      "Pastes auto-delete after 15 minutes. For ephemeral sharing — discussions, quick reviews, one-time reads — it's perfect.",
    ],
  },
  claude: {
    title: "Share Long Prompts with Claude — Pastelet",
    heading: "Share long prompts with Claude",
    description: "Create shareable links for long Claude prompts and system instructions.",
    content: [
      "Claude excels at processing long context, but sharing those long system prompts and instructions with others is hard.",
      "Pastelet creates instant, readable links for your prompts. Share your Claude system instructions, conversation starters, or analysis requests with a single link.",
      "Everything auto-deletes after 15 minutes. Share sensitive prompts without worrying about permanence.",
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(pages).map((usecase) => ({ usecase }));
}

export async function generateMetadata({ params }: { params: Promise<{ usecase: string }> }): Promise<Metadata> {
  const { usecase } = await params;
  const page = pages[usecase];
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    openGraph: { title: page.title, description: page.description },
  };
}

export default async function UseCasePage({ params }: { params: Promise<{ usecase: string }> }) {
  const { usecase } = await params;
  const page = pages[usecase];
  if (!page) notFound();

  return (
    <div className="max-w-2xl mx-auto px-6 pt-24 pb-16 animate-fade-in">
      <div className="mb-12">
        <h1 className="text-4xl font-light tracking-tight mb-3">{page.heading}</h1>
        <p className="text-lg text-gray-400 font-light">{page.description}</p>
      </div>
      <PasteForm />
      <div className="mt-20 space-y-6">
        {page.content.map((p, i) => (
          <p key={i} className="text-gray-500 leading-relaxed text-base">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
