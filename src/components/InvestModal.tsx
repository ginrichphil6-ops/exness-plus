import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  ArrowRight, 
  CheckCircle2, 
  Smartphone, 
  Copy, 
  Check, 
  TrendingUp, 
  Info,
  ShieldCheck,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { formatXAF } from '../utils/formatters';
import { TOP_UP_PRESETS } from '../data/mockData';

interface InvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDeposit: (amount: number, method: string) => void;
  currentDeposit: number;
}

export const InvestModal: React.FC<InvestModalProps> = ({
  isOpen,
  onClose,
  onConfirmDeposit,
  currentDeposit,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [copiedRef, setCopiedRef] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMode, setSuccessMode] = useState(false);
  const [lastAddedAmount, setLastAddedAmount] = useState(0);

  if (!isOpen) return null;

  const depositAmount = customAmount ? parseFloat(customAmount) || 0 : selectedPreset;
  const projectedReturnAddition = depositAmount * 4.75;
  const newProjectedTotal = (currentDeposit + depositAmount) * 4.75;

  // MTN Mobile Money USSD code format: *126*9*674940023*<Amount>#
  const formattedAmountForCode = depositAmount > 0 ? Math.round(depositAmount).toString() : 'Amount';
  const momoUssdCode = `*126*9*674940023*${formattedAmountForCode}#`;
  const paymentMethodName = 'MTN Mobile Money';

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(momoUssdCode);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleSimulateDeposit = () => {
    if (depositAmount <= 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setSuccessMode(true);
      setLastAddedAmount(depositAmount);
      onConfirmDeposit(depositAmount, paymentMethodName);
    }, 1200);
  };

  const handleResetAndClose = () => {
    setSuccessMode(false);
    setCustomAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#0b1220] border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0d1627]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Top Up Investment Capital
              </h3>
              <p className="text-xs text-slate-400">
                Increase your active compounding balance under the 6-Month Prime Guarantee
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {successMode ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-white">Top-Up Successful & Credited!</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                <span className="font-mono text-emerald-400 font-bold">+{formatXAF(lastAddedAmount)}</span> has been credited to Mbifong Cornelius's portfolio ledger and immediately locked into the 6-month compounding contract.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 space-y-1.5 max-w-sm mx-auto text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Credited Amount:</span>
                <span className="text-white font-bold">+{formatXAF(lastAddedAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span className="text-yellow-400 font-semibold">{paymentMethodName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Updated 6M Projected:</span>
                <span className="text-amber-400 font-bold">{formatXAF(newProjectedTotal)}</span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Step 1: Select Amount */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2.5">
                1. Select Top-Up Amount (XAF)
              </label>

              {/* Preset buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {TOP_UP_PRESETS.map((preset) => (
                  <button
                    key={preset.amount}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(preset.amount);
                      setCustomAmount('');
                    }}
                    className={`py-2 px-2.5 text-xs font-mono font-medium rounded-xl border transition-all text-center ${
                      selectedPreset === preset.amount && !customAmount
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <div className="relative">
                <input
                  type="number"
                  placeholder="Or enter custom amount in XAF..."
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder:text-slate-500 outline-none transition-colors"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">
                  XAF
                </span>
              </div>
            </div>

            {/* Dynamic Projected Return Calculation Box */}
            <div className="bg-gradient-to-br from-slate-900 to-[#101b30] border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Projected Yield Impact
                </span>
                <span className="font-mono text-amber-400 font-semibold">4.75x Multiplier</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Additional Capital</span>
                  <span className="text-sm font-bold text-white font-mono">
                    +{formatXAF(depositAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Additional Projected Return</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    +{formatXAF(projectedReturnAddition)}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Total Projected Return (at 6M):</span>
                <span className="font-mono text-amber-300 font-bold">
                  {formatXAF(newProjectedTotal)}
                </span>
              </div>
            </div>

            {/* Step 2: Payment Channel - MTN Mobile Money Only */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  2. Deposit Channel
                </label>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2 py-0.5 rounded">
                  Official MoMo Gateway
                </span>
              </div>

              <div className="p-3.5 rounded-xl border bg-slate-800/80 border-yellow-500/50 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>MTN Mobile Money (MoMo)</span>
                        <span className="text-[10px] font-mono text-yellow-300 bg-yellow-950/60 px-1.5 py-0.5 rounded border border-yellow-700/40">
                          Active Channel
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Direct USSD transfer · Instant credit to Mbifong Cornelius vault
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: USSD Dialing String & Instructions */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-yellow-400" />
                  MoMo USSD Payment Code:
                </span>
                <span className="text-[11px] font-mono text-emerald-400">Auto-formatted with Amount</span>
              </div>

              {/* Prominent USSD Code Display */}
              <div className="flex items-center justify-between bg-black/60 border border-yellow-500/40 rounded-xl p-3 font-mono">
                <div className="truncate pr-2">
                  <span className="text-slate-500 block text-[10px] uppercase font-sans tracking-wider">
                    Dial Directly On Your MTN Line:
                  </span>
                  <span className="text-yellow-400 select-all font-bold text-sm sm:text-base tracking-wide">
                    {momoUssdCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                  title="Copy USSD Code"
                >
                  {copiedRef ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Instructions list */}
              <div className="text-[11px] text-slate-400 space-y-1.5 pt-1">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-yellow-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <span>Dial <strong className="font-mono text-yellow-300">{momoUssdCode}</strong> from your MTN phone.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-yellow-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <span>Confirm transfer of <strong className="text-white font-mono">{formatXAF(depositAmount)}</strong> to recipient <strong>674940023</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-yellow-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <span>Enter your MoMo PIN to validate. Funds credit automatically to account <strong className="font-mono text-slate-300">EXP-CM-904128</strong>.</span>
                </div>
              </div>
            </div>

            {/* Confirmation CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSimulateDeposit}
                disabled={isProcessing || depositAmount <= 0}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying MoMo Transfer & Crediting Vault...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Credit Deposit ({formatXAF(depositAmount)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
