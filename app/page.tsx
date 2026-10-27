"use client";

import { useState } from "react";
import { WalletButton } from "@/components/WalletButton";
import { GuestbookForm } from "@/components/GuestbookForm";
import { MessageList } from "@/components/MessageList";
import { BOT_GUESTBOOK_ADDRESS, getExplorerAddressUrl, formatAddress } from "@/lib/contract";
import { BookOpen, Sparkles, ExternalLink, ShieldCheck, Activity, Globe, Copy, Check } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleMessageAdded = () => {
    // Increment to trigger message list refetch
    setRefreshKey((prev) => prev + 1);
  };

  const handleCopyAddress = () => {
    if (BOT_GUESTBOOK_ADDRESS) {
      navigator.clipboard.writeText(BOT_GUESTBOOK_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Mainnet
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                A simple on-chain guestbook on Botchain Mainnet
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/80 border border-slate-700/70 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors shadow-sm"
              title="Official BOT Chain Website"
            >
              <Image
                src="/botchain-icon.png"
                alt="BOT Chain Logo"
                width={16}
                height={16}
                className="w-4 h-4 rounded-sm object-contain shrink-0"
              />
              <span>BOT Chain</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/80 border border-slate-700/70 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors shadow-sm"
              title="Open Botchain Mainnet Explorer"
            >
              <Image
                src="/botchain-icon.png"
                alt="BOT Chain Logo"
                width={16}
                height={16}
                className="w-4 h-4 rounded-sm object-contain shrink-0"
              />
              <span>Explorer</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
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
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-400 font-mono">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/60 border border-slate-800">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>Chain ID: 677</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/60 border border-slate-800">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Native Token: BOT (150M Supply)</span>
            </span>
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-emerald-300 hover:border-emerald-500/40 transition-colors"
            >
              <Image
                src="/botchain-icon.png"
                alt="BOT Chain"
                width={14}
                height={14}
                className="w-3.5 h-3.5 rounded-sm object-contain"
              />
              <span>BOT Chain Website</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
            >
              <Image
                src="/botchain-icon.png"
                alt="BOT Chain"
                width={14}
                height={14}
                className="w-3.5 h-3.5 rounded-sm object-contain"
              />
              <span>BOT Chain Explorer</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
            <div className="inline-flex items-center rounded-md bg-slate-900/80 border border-cyan-500/40 text-xs text-cyan-300 overflow-hidden shadow-sm">
              <a
                href={getExplorerAddressUrl(BOT_GUESTBOOK_ADDRESS)}
                target="_blank"
                rel="noopener noreferrer"
                title="View Mainnet Contract on Botchain Explorer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 hover:text-white hover:bg-cyan-500/10 transition-colors"
              >
                <span className="font-medium text-slate-400">Mainnet Contract:</span>
                <span className="font-mono text-cyan-300 font-semibold">{formatAddress(BOT_GUESTBOOK_ADDRESS)}</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
              <button
                onClick={handleCopyAddress}
                title="Copy Mainnet Contract Address"
                className="p-1 px-2 border-l border-cyan-500/30 hover:bg-cyan-500/20 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
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

        {/* BOT Chain Ecosystem Banner */}
        <section className="pt-4">
          <div className="glass-panel rounded-2xl p-6 sm:p-7 relative overflow-hidden border border-cyan-500/20 bg-gradient-to-br from-slate-950/90 via-slate-900/60 to-cyan-950/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2.5">
                  <Image
                    src="/botchain-logo.svg"
                    alt="BOT Chain Logo"
                    width={140}
                    height={32}
                    className="h-7 w-auto"
                  />
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    Ecosystem
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  BotGuestbook is proudly deployed on <strong className="text-white font-semibold">BOT Chain</strong> — a high-speed, EVM-compatible blockchain powering next-generation intelligent dApps with micro-cent gas fees and instant block settlement.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
                <a
                  href="https://botchain.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Image
                    src="/botchain-icon.png"
                    alt="BOT Chain Logo"
                    width={18}
                    height={18}
                    className="w-4 h-4 rounded-sm object-contain shrink-0"
                  />
                  <span>BOT Chain Website</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>
                <a
                  href="https://scan.botchain.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-cyan-500/40 transition-all cursor-pointer shadow-sm"
                >
                  <Image
                    src="/botchain-icon.png"
                    alt="BOT Chain Logo"
                    width={18}
                    height={18}
                    className="w-4 h-4 rounded-sm object-contain shrink-0"
                  />
                  <span>BOT Chain Explorer</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-slate-950/70 backdrop-blur-xl py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* BOT Chain Branding */}
            <div className="flex items-center gap-3">
              <Image
                src="/botchain-icon.png"
                alt="BOT Chain Logo"
                width={24}
                height={24}
                className="w-6 h-6 rounded-md object-contain shrink-0"
              />
              <span className="font-bold text-sm text-white tracking-wide">BOT Chain</span>
              <span className="text-slate-600">|</span>
              <span className="text-xs text-slate-400 font-medium">
                Official Ecosystem DApp
              </span>
            </div>

            {/* Required Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs">
              <a
                href="https://botchain.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors font-medium"
              >
                <Image
                  src="/botchain-icon.png"
                  alt="BOT Chain"
                  width={14}
                  height={14}
                  className="w-3.5 h-3.5 rounded-sm object-contain"
                />
                <span>BOT Chain Website</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
              <a
                href="https://scan.botchain.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-cyan-400 transition-colors font-medium"
              >
                <Image
                  src="/botchain-icon.png"
                  alt="BOT Chain"
                  width={14}
                  height={14}
                  className="w-3.5 h-3.5 rounded-sm object-contain"
                />
                <span>BOT Chain Explorer</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
              <a
                href="https://rpc.botchain.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-cyan-400 transition-colors"
              >
                RPC Endpoint
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>© 2026 BotGuestbook · Immutable Web3 Social Guestbook on BOT Chain (Chain ID: 677)</p>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-slate-400">Mainnet Contract:</span>
              <a
                href={getExplorerAddressUrl(BOT_GUESTBOOK_ADDRESS)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 hover:underline inline-flex items-center gap-1"
                title="View on Botchain Explorer"
              >
                <span>{BOT_GUESTBOOK_ADDRESS}</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
