import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "BotGuestbook | On-Chain Guestbook on Botchain",
  description:
    "A simple decentralized guestbook where messages are stored directly on Botchain Mainnet.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="cyber-bg text-slate-100 antialiased min-h-screen selection:bg-cyan-500/30 selection:text-cyan-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
