"use client";

import { useReadContract } from "wagmi";
import {
  BOT_GUESTBOOK_ABI,
  BOT_GUESTBOOK_ADDRESS,
  formatAddress,
  formatTimestamp,
  getExplorerAddressUrl,
} from "@/lib/contract";
import { MessageSquare, ExternalLink, RefreshCw, Clock, User, AlertTriangle } from "lucide-react";

interface MessageItem {
  sender: string;
  text: string;
  timestamp: bigint;
}

export function MessageList({ refreshSignal }: { refreshSignal?: number }) {
  const isContractConfigured = Boolean(BOT_GUESTBOOK_ADDRESS);

  const {
    data: messages,
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useReadContract({
    address: BOT_GUESTBOOK_ADDRESS,
    abi: BOT_GUESTBOOK_ABI,
    functionName: "getAllMessages",
    query: {
      enabled: isContractConfigured,
      refetchInterval: 12000,
    },
  });

  if (!isContractConfigured) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center border-dashed border-slate-700/60">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-200 mb-1">
          Guestbook contract not configured yet
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Deploy the smart contract to Botchain Testnet and set <code className="text-cyan-400 font-mono">NEXT_PUBLIC_BOT_GUESTBOOK_ADDRESS</code> in your environment to view and sign messages.
        </p>
      </div>
    );
  }

  // Cast safely
  const messageList = (messages as unknown as MessageItem[] | undefined) || [];
  // Sort newest first
  const displayMessages = [...messageList].reverse();

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Messages ({messageList.length})
          </h3>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-cyan-300 hover:bg-white/[0.05] transition-colors cursor-pointer disabled:opacity-50"
          title="Refresh messages"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin text-cyan-400" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Loading state skeleton */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="glass-panel rounded-2xl p-5 border border-slate-800 animate-pulse space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 bg-slate-800 rounded-md" />
                <div className="h-3 w-24 bg-slate-800/60 rounded-md" />
              </div>
              <div className="h-4 w-5/6 bg-slate-800/80 rounded-md" />
              <div className="h-3 w-1/2 bg-slate-800/40 rounded-md" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="glass-panel rounded-2xl p-6 text-center border-rose-500/30">
          <p className="text-sm text-rose-300 mb-3">
            Unable to load guestbook messages from Botchain Testnet.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 text-rose-200 hover:bg-rose-500/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && displayMessages.length === 0 && (
        <div className="glass-panel rounded-2xl p-10 text-center border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center mb-3">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-200 mb-1">
            No messages yet
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Be the first pioneer to sign the guestbook and record your mark on Botchain Testnet!
          </p>
        </div>
      )}

      {/* Message Cards (Newest First) */}
      {!isLoading && !error && displayMessages.length > 0 && (
        <div className="space-y-3">
          {displayMessages.map((msg, idx) => {
            const explorerUrl = getExplorerAddressUrl(msg.sender);
            return (
              <div
                key={`${msg.sender}-${msg.timestamp}-${idx}`}
                className="glass-panel glass-panel-hover rounded-2xl p-5 border border-slate-800/80 relative transition-all"
              >
                {/* Top Row: Sender Address + Timestamp */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 pb-2.5 border-b border-white/[0.04]">
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View sender on Botchain Explorer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-cyan-400 hover:text-cyan-300 transition-colors group"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    <span>{formatAddress(msg.sender)}</span>
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>

                  <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-normal">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{formatTimestamp(msg.timestamp)}</span>
                  </div>
                </div>

                {/* Message Body */}
                <p className="text-sm text-slate-200 leading-relaxed break-words whitespace-pre-wrap">
                  {msg.text}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
