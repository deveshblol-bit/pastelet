import type { Metadata } from "next";
import PasteWidget from "./PasteWidget";

const useCases: Record<string, { title: string; heading: string; description: string; content: string[] }> = {
  telegram: {
    title: "Share Long Text on Telegram — Pastelet",
    heading: "Share long text on Telegram",
    description: "Bypass Telegram's 4096 character limit. Paste your text, get a link, share it in any chat.",
    content: [
      "Telegram limits messages to 4,096 characters. That's fine for most messages — but not for code snippets, articles, meeting notes, or long-form writing.",
      "Pastelet gives you a link in seconds. Paste your text, send the link to any Telegram chat, and recipients can read the full content in their browser. Clean, fast, no signup.",
      "Links auto-expire in 15 minutes, so sensitive content doesn't linger. Perfect for sharing drafts, logs, or anything you don't want permanently hosted.",
    ],
  },
  discord: {
    title: "Bypass Discord Character Limits — Pastelet",
    heading: "Bypass Discord's character limit",
    description: "Discord caps messages at 2000 characters. Share longer text instantly with a temporary link.",
    content: [
      "Discord's 2,000 character limit is one of its most frustrating constraints. Whether you're sharing code, a story, game rules, or a detailed explanation — you hit the wall fast.",
      "Instead of splitting your message into 5 parts (or uploading a .txt file nobody opens), paste it here and share the link. Clean formatting, instant access, no file downloads.",
      "Your paste self-destructs in 15 minutes. No clutter, no permanent hosting, no data collection.",
    ],
  },
  "ai-agents": {
    title: "Share Context with AI Agents — Pastelet",
    heading: "Share context with AI agents",
    description: "Give AI agents large text context via a simple URL they can fetch. Auto-expires in 15 minutes.",
    content: [
      "AI agents often need to consume large blocks of text — documents, code files, conversation logs, research notes. But most agent interfaces have input limits.",
      "Pastelet gives you a /raw/ endpoint that returns plain text with no HTML, no JavaScript, no cookies. Perfect for programmatic access. Agents can fetch the URL and get clean content.",
      "POST to /api/paste with {\"text\": \"...\"} to create pastes programmatically. The response includes both a human-readable URL and a raw URL for machine consumption.",
    ],
  },
  chatgpt: {
    title: "Share Long Prompts with ChatGPT — Pastelet",
    heading: "Share long prompts with ChatGPT",
    description: "Store and share complex ChatGPT prompts, system messages, and conversation context via temporary links.",
    content: [
      "Complex ChatGPT prompts can be thousands of words — system instructions, few-shot examples, context documents. Sharing them on Twitter, Discord, or forums means they get truncated.",
      "Paste your prompt here, share the link. Anyone can view the full prompt and copy it directly into ChatGPT. No formatting issues, no character limits.",
      "Links expire in 15 minutes, which makes this ideal for sharing prompts in real-time conversations without them living on the internet forever.",
    ],
  },
  claude: {
    title: "Share Long Prompts with Claude — Pastelet",
    heading: "Share long prompts with Claude",
    description: "Temporarily host complex Claude prompts, XML templates, and system instructions for easy sharing.",
    content: [
      "Claude excels with structured prompts — XML tags, detailed system instructions, multi-turn examples. These prompts are often too long to share in a chat message.",
      "Pastelet preserves your formatting perfectly. Paste your Claude prompt, get a link, share it anywhere. Recipients see the exact text with all whitespace and structure intact.",
      "Ephemeral by design — your prompt disappears after 15 minutes. Share it when you need to, and it cleans itself up.",
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(useCases).map((usecase) => ({ usecase }));
}

export async function generateMetadata({ params }: { params: Promise<{ usecase: string }> }): Promise<Metadata> {
  const { usecase } = await params;
  const uc = useCases[usecase];
  if (!uc) return { title: "Pastelet" };
  return {
    title: uc.title,
    description: uc.description,
    openGraph: { title: uc.title, description: uc.description },
  };
}

export default async function UseCasePage({ params }: { params: Promise<{ usecase: string }> }) {
  const { usecase } = await params;
  const uc = useCases[usecase];

  if (!uc) {
    return (
      <main className="max-w-2xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-3xl font-semibold mb-3">Not Found</h1>
        <a href="/" className="text-accent">← Back to Pastelet</a>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 pt-24 pb-16 animate-fade-in">
      <a href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors font-light">
        ← Pastelet
      </a>
      <h1 className="text-4xl font-semibold tracking-tight mt-6 mb-4">{uc.heading}</h1>
      <p className="text-lg text-gray-500 font-light mb-10">{uc.description}</p>

      <PasteWidget />

      <div className="mt-16 space-y-6">
        {uc.content.map((p, i) => (
          <p key={i} className="text-gray-600 leading-relaxed font-light">{p}</p>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-lg font-medium mb-4">How it works</h2>
        <ol className="space-y-3 text-gray-600 font-light">
          <li className="flex gap-3"><span className="text-accent font-medium">1.</span> Paste your text above</li>
          <li className="flex gap-3"><span className="text-accent font-medium">2.</span> Click "Create Paste" to get a link</li>
          <li className="flex gap-3"><span className="text-accent font-medium">3.</span> Share the link anywhere — it works for 15 minutes</li>
          <li className="flex gap-3"><span className="text-accent font-medium">4.</span> The paste auto-deletes. No traces.</li>
        </ol>
      </div>
    </main>
  );
}
