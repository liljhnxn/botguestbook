"use client";

import { useState } from "react";
import { WalletButton } from "@/components/WalletButton";
import { GuestbookForm } from "@/components/GuestbookForm";
import { MessageList } from "@/components/MessageList";
import { BOT_GUESTBOOK_ADDRESS, getExplorerAddressUrl } from "@/lib/contract";
import { BookOpen, Sparkles, ExternalLink, ShieldCheck, Activity } from "lucide-react";

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleMessageAdded = () => {
    // Increment to trigger message list refetch
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between cyber-grid">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between py-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  BotGuestbook
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Testnet
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                A simple on-chain guestbook on Botchain
              </p>
            </div>
          </div>

          {/* Wallet Actions */}
          <div className="flex items-center gap-3">
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-3 pt-2 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Immutable & Decentralized Web3 Guestbook</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Leave Your Mark on{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Botchain
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Connect your wallet to sign the guestbook. Every greeting, thought, and milestone is recorded permanently on the Botchain blockchain.
          </p>

          {/* Network details pill */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-slate-400 font-mono">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/60 border border-slate-800">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>Chain ID: 968</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/60 border border-slate-800">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Gas: Native BOT</span>
            </span>
            {BOT_GUESTBOOK_ADDRESS && (
              <a
                href={getExplorerAddressUrl(BOT_GUESTBOOK_ADDRESS)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors"
              >
                <span>Contract</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </section>

        {/* Guestbook Form */}
        <section>
          <GuestbookForm onMessageAdded={handleMessageAdded} />
        </section>

        {/* Message Feed */}
        <section className="pt-2">
          <MessageList refreshSignal={refreshKey} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-slate-950/40 py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 BotGuestbook · On-chain guestbook on Botchain Testnet</p>
          <div className="flex items-center gap-4">
            <a
              href="https://scan.bohr.life"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
            >
              <span>Botchain Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://rpc.bohr.life"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              RPC Endpoint
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
