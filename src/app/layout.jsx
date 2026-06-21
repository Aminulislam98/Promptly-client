import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TokenSync } from "@/components/providers/TokenSync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Promptly — AI Prompt Marketplace",
    template: "%s | Promptly",
  },
  description:
    "Discover, share and copy AI prompts for ChatGPT, Claude, Midjourney, Gemini and more. Browse thousands of community-curated prompts or unlock premium ones with a one-time $5 payment.",
  keywords: ["AI prompts", "ChatGPT prompts", "Claude prompts", "Midjourney prompts", "prompt marketplace"],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Promptly — AI Prompt Marketplace",
    description: "Discover and share the best AI prompts for ChatGPT, Claude, Midjourney and more.",
    type: "website",
    siteName: "Promptly",
  },
  twitter: {
    card: "summary",
    title: "Promptly — AI Prompt Marketplace",
    description: "Discover and share the best AI prompts for ChatGPT, Claude, Midjourney and more.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TokenSync />
        <Navbar />
        <Toaster position="top-center" />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
