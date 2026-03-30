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
  whatsapp: {
    title: "Share Long Text on WhatsApp — Pastelet",
    heading: "Share long text on WhatsApp",
    description: "WhatsApp truncates long messages. Share full-length text with a temporary link instead.",
    content: [
      "WhatsApp has a 65,536 character limit, but long messages become unreadable walls of text that nobody scrolls through. Group chats make it worse — your message gets buried instantly.",
      "Pastelet gives you a clean, readable link. Paste your text, share the link in any WhatsApp chat. Recipients tap the link and read your full message in a formatted, easy-to-read page.",
      "The link self-destructs in 15 minutes. Perfect for sharing meeting notes, addresses, instructions, or anything you don't want lingering in chat history.",
    ],
  },
  slack: {
    title: "Bypass Slack Character Limits — Pastelet",
    heading: "Bypass Slack's character limit",
    description: "Slack caps messages at 40,000 characters and snippets are clunky. Share long text cleanly with Pastelet.",
    content: [
      "Slack's message limit is generous, but code reviews, RFCs, and documentation dumps still hit it. And Slack's built-in snippets are clunky — they require extra clicks and don't preview well on mobile.",
      "Paste your text here, drop the link in Slack. It unfurls cleanly, loads instantly, and the full content is readable without downloading anything.",
      "Auto-expires in 15 minutes. No permanent URLs cluttering your workspace, no files to manage, no permissions to set.",
    ],
  },
  "code-review": {
    title: "Share Code Snippets for Review — Pastelet",
    heading: "Share code snippets for review",
    description: "Quickly share code with teammates for review. No signup, auto-deletes in 15 minutes.",
    content: [
      "Need a quick code review but don't want to create a gist, open a PR, or paste into a Google Doc? Pastelet is faster than all of them.",
      "Paste your code, share the link in Slack, Discord, or any chat. Your teammate reads it in a clean monospace view. No syntax highlighting distractions — just the code.",
      "The paste disappears in 15 minutes. Perfect for 'hey can you look at this real quick' moments. No cleanup, no forgotten public gists with API keys in them.",
    ],
  },
  "meeting-notes": {
    title: "Share Meeting Notes Temporarily — Pastelet",
    heading: "Share meeting notes temporarily",
    description: "Share meeting notes that auto-delete in 15 minutes. Perfect for quick distribution without permanent hosting.",
    content: [
      "Just finished a meeting and need to share notes with the team? Don't create a Google Doc for 10 bullet points. Don't email a wall of text. Just paste and share.",
      "Pastelet gives you a clean link in 2 seconds. Drop it in your team's Slack channel or group chat. Everyone reads it, nobody has to request access or open an app.",
      "Notes auto-delete in 15 minutes — long enough for everyone to read them, short enough that sensitive discussion points don't live on a server forever.",
    ],
  },
  "error-logs": {
    title: "Share Error Logs & Stack Traces — Pastelet",
    heading: "Share error logs and stack traces",
    description: "Paste error logs and stack traces to share with your team. Clean formatting, auto-expires.",
    content: [
      "Stack traces are long, ugly, and impossible to read when pasted into Slack or Discord. They break formatting, lose indentation, and get truncated.",
      "Paste your error log here. The monospace formatting is preserved perfectly. Share the link with your team or paste it in a GitHub issue. The /raw/ endpoint is perfect for bots and monitoring tools.",
      "Expires in 15 minutes — long enough to debug, short enough that sensitive log data doesn't persist. No more stack traces with database credentials sitting in public gists.",
    ],
  },
  "self-destructing": {
    title: "Self-Destructing Text — Pastelet",
    heading: "Self-destructing text messages",
    description: "Send text that automatically deletes itself after 15 minutes. No signup, no app needed.",
    content: [
      "Sometimes you need to share something that shouldn't stick around — a password, an address, a private note, draft feedback. Email is permanent. Chat logs are searchable. You need something ephemeral.",
      "Pastelet creates a temporary link for your text. Share it however you want. After 15 minutes, the content is gone — not archived, not cached, genuinely deleted from the server.",
      "No signup, no app download, no account needed. Just paste, share, and forget. The internet doesn't need to remember everything.",
    ],
  },
  twitter: {
    title: "Share Long Text on Twitter/X — Pastelet",
    heading: "Share long text on Twitter/X",
    description: "Twitter limits posts to 280 characters. Share your full thoughts with a temporary Pastelet link.",
    content: [
      "Twitter's 280 character limit forces you to thread, screenshot text, or link to external sites. Threads get messy. Screenshots aren't accessible. Blog posts are overkill for a quick thought.",
      "Paste your full text here, share the Pastelet link in your tweet. Followers click and read — clean, formatted, no ads, no signup walls. Way better than a Notes app screenshot.",
      "The link expires in 15 minutes, which is perfect for live conversations, Twitter Spaces follow-ups, or sharing context during a trending topic.",
    ],
  },
  reddit: {
    title: "Share Long Text on Reddit — Pastelet",
    heading: "Share long text on Reddit",
    description: "Share formatted text beyond Reddit's comment limits with a clean temporary link.",
    content: [
      "Reddit comments have a 10,000 character limit. For detailed guides, stories, analyses, or copypastas — that's not always enough. And Reddit's formatting is... temperamental.",
      "Paste your full text here and share the link in your comment. Clean formatting, instant loading, no 'Part 1/7' comment chains.",
      "Auto-deletes in 15 minutes. Perfect for sharing in live threads, AMAs, or game-day discussions where the context is only relevant right now.",
    ],
  },
  gemini: {
    title: "Share Long Prompts with Gemini — Pastelet",
    heading: "Share long prompts with Gemini",
    description: "Share complex Gemini prompts and context via temporary links. Auto-expires in 15 minutes.",
    content: [
      "Gemini handles long context well, but sharing your carefully crafted prompts with others is harder. Forum character limits, chat truncation, and formatting issues get in the way.",
      "Paste your Gemini prompt here — system instructions, examples, context documents, everything. Share the link and recipients get the exact text, perfectly formatted.",
      "Expires in 15 minutes. Share it when discussing prompt engineering, comparing AI outputs, or collaborating on complex instructions.",
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
