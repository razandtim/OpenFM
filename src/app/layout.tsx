import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";

import "./globals.css";
import { PlayerProvider } from "@/context/player-context";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OpenFM",
  description:
    "AI-generated, royalty-safe mood radio for creators. Switch moods, surface metadata, and keep your stream in vibe lock.",
  openGraph: {
    title: "OpenFM",
    description: "Mood-perfect royalty-free radio for streamers.",
    url: "https://openfm.local",
    siteName: "OpenFM",
  },
  metadataBase: new URL("https://openfm.local"),
  twitter: {
    card: "summary_large_image",
    title: "OpenFM",
    description: "Mood-perfect royalty-free radio for streamers.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${grotesk.variable} ${inter.variable} bg-slate-950 text-white antialiased`}
      >
        <PlayerProvider>{children}</PlayerProvider>
      </body>
    </html>
  );
}
