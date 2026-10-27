"use client";

import { useState } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { botchainMainnet } from "@/lib/botchain";
import {
  BOT_GUESTBOOK_ABI,
  BOT_GUESTBOOK_ADDRESS,
  getExplorerTxUrl,
} from "@/lib/contract";
import {
  PenLine,
  Send,
  Loader2,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";

interface GuestbookFormProps {
  onMessageAdded?: () => void;
}

export function GuestbookForm({ onMessageAdded }: GuestbookFormProps) {
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const { isConnected } = useAccount();
  const chainId = useChainId();

  const isContractConfigured = Boolean(BOT_GUESTBOOK_ADDRESS);
  const isWrongNetwork = isConnected && chainId !== botchainMainnet.id;

  const {
    writeContract,
    data: txHash,
    isPending: isWalletPromptPending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isTxConfirming,
    isSuccess: isTxSuccess,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
    query: {
      enabled: Boolean(txHash),
    },
  });

  const isPending = isWalletPromptPending || isTxConfirming;
  const characterCount = message.length;
  const maxCharacters = 280;
  const isOverLimit = characterCount > maxCharacters;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!isContractConfigured) {
      setValidationError("Guestbook contract not configured yet.");
      return;
    }

    if (!isConnected) {
      setValidationError("Please connect your wallet first.");
      return;
    }

    if (isWrongNetwork) {
      setValidationError("Please switch to Botchain Mainnet to sign the guestbook.");
      return;
    }

    const trimmed = message.trim();
    if (!trimmed) {
      setValidationError("Please enter a message before signing.");
      return;
    }

    if (trimmed.length > maxCharacters) {
      setValidationError(`Message exceeds the maximum limit of ${maxCharacters} characters.`);
      return;
    }

    // Submit transaction
    resetWrite();
    writeContract(
      {
        address: BOT_GUESTBOOK_ADDRESS!,
        abi: BOT_GUESTBOOK_ABI,
        functionName: "addMessage",
        args: [trimmed],
      },
      {
        onSuccess: () => {
          setMessage("");
          onMessageAdded?.();
        },
      }
    );
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7 relative overflow-hidden">
      {/* Decorative accent gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-60" />

      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <PenLine className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-100">Sign the Guestbook</h2>
          <p className="text-xs text-slate-400">
            Write a message to be permanently etched into Botchain Mainnet.
          </p>
        </div>
      </div>

      {!isContractConfigured && (
        <div className="mb-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-200">
            <span className="font-semibold block text-amber-300 mb-0.5">
              Guestbook contract not configured yet
            </span>
            Please configure <code className="px-1.5 py-0.5 rounded bg-black/40 font-mono text-xs">NEXT_PUBLIC_BOT_GUESTBOOK_ADDRESS</code> in your environment to enable signing.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="guestbook-message" className="sr-only">
            Guestbook Message
          </label>
          <div className="relative">
            <textarea
              id="guestbook-message"
              rows={4}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (validationError) setValidationError(null);
              }}
              disabled={isPending || !isContractConfigured}
              placeholder={
                !isConnected
                  ? "Connect your wallet to sign the guestbook..."
                  : "Say hello, leave feedback, or immortalize your milestone on Botchain (max 280 characters)..."
              }
              className={`w-full p-4 rounded-xl bg-slate-950/70 text-slate-100 placeholder-slate-500 text-sm border focus:outline-none transition-all resize-none ${
                isOverLimit
                  ? "border-rose-500/80 focus:border-rose-400"
                  : "border-slate-800 focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            />

            {/* Character counter */}
            <div className="absolute bottom-3 right-3 text-xs font-mono">
              <span
                className={
                  isOverLimit
                    ? "text-rose-400 font-bold"
                    : characterCount > 240
                    ? "text-amber-400 font-medium"
                    : "text-slate-500"
                }
              >
                {characterCount}
              </span>
              <span className="text-slate-600"> / {maxCharacters}</span>
            </div>
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Transaction Error Banner */}
        {(writeError || txError) && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="break-all">
              <span className="font-semibold block">Transaction Failed:</span>
              {writeError?.message?.includes("User rejected")
                ? "Wallet transaction was rejected by user."
                : writeError?.message?.slice(0, 150) || txError?.message?.slice(0, 150)}
            </div>
          </div>
        )}

        {/* Live Transaction Status Indicators */}
        {isWalletPromptPending && (
          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-3 text-xs sm:text-sm text-cyan-200">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
            <span>Confirm transaction in your wallet...</span>
          </div>
        )}

        {isTxConfirming && txHash && (
          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between gap-3 text-xs sm:text-sm text-blue-200">
            <div className="flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400 shrink-0" />
              <span>Transaction submitted... awaiting on-chain confirmation</span>
            </div>
            <a
              href={getExplorerTxUrl(txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-300 hover:text-white underline shrink-0"
            >
              <span>View Tx</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {isTxSuccess && txHash && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs sm:text-sm text-emerald-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium">Message added successfully!</span>
            </div>
            <a
              href={getExplorerTxUrl(txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-emerald-300 hover:text-white underline shrink-0 font-medium"
            >
              <span>View Explorer Tx</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isPending || isOverLimit || !isContractConfigured}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-w-[150px]"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Sign Guestbook</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
