import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pastelet — Ephemeral Text Sharing",
  description: "Share text that disappears in 15 minutes. No signup, no tracking. Just paste and share.",
  openGraph: {
    title: "Pastelet — Ephemeral Text Sharing",
    description: "Share text that disappears in 15 minutes. No signup, no tracking.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-[#111] min-h-screen">
        {children}
        <footer className="text-center py-8 text-sm text-gray-400 font-light">
          Pastelet — ephemeral text sharing
        </footer>
      </body>
    </html>
  );
}
