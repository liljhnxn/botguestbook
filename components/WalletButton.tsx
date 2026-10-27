"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain, useChainId } from "wagmi";
import { botchainMainnet } from "@/lib/botchain";
import { formatAddress, getExplorerAddressUrl } from "@/lib/contract";
import { Wallet, LogOut, AlertTriangle, ExternalLink, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export function WalletButton() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const { connectors, connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-36 rounded-xl bg-slate-800/60 animate-pulse border border-slate-700/50" />
    );
  }

  // Not connected state
  if (!isConnected || !address) {
    const primaryConnector = connectors[0];
    return (
      <button
        onClick={() => primaryConnector && connect({ connector: primaryConnector })}
        disabled={isConnecting}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            <span>Connect Wallet</span>
          </>
        )}
      </button>
    );
  }

  // Wrong network state
  const isWrongNetwork = chainId !== botchainMainnet.id;
  if (isWrongNetwork) {
    return (
      <button
        onClick={() => switchChain({ chainId: botchainMainnet.id })}
        disabled={isSwitching}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all cursor-pointer shadow-lg shadow-amber-500/10"
      >
        {isSwitching ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Switching...</span>
          </>
        ) : (
          <>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Switch to Botchain Mainnet</span>
          </>
        )}
      </button>
    );
  }

  // Connected to Botchain Mainnet
  return (
    <div className="flex items-center gap-2">
      {/* Network Badge */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Botchain Mainnet</span>
      </div>

      {/* Account Info Pill */}
      <div className="flex items-center rounded-xl bg-slate-900/80 border border-slate-700/70 p-1">
        <a
          href={getExplorerAddressUrl(address)}
          target="_blank"
          rel="noopener noreferrer"
          title="View on Botchain Explorer"
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium text-slate-200 hover:text-cyan-400 transition-colors"
        >
          <span>{formatAddress(address)}</span>
          <ExternalLink className="w-3 h-3 opacity-60 hover:opacity-100" />
        </a>

        <button
          onClick={() => disconnect()}
          title="Disconnect wallet"
          className="p-1.5 ml-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
