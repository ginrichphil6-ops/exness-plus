import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Download, 
  Printer, 
  ShieldCheck, 
  Copy, 
  Check, 
  TrendingUp, 
  Building,
  User
} from 'lucide-react';
import { Transaction, PortfolioData } from '../types';
import { formatXAF } from '../utils/formatters';

interface ReceiptModalProps {
  transaction: Transaction | null;
  portfolio: PortfolioData;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  portfolio,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!transaction) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(transaction.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#0b1220] border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0e172a]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white tracking-tight">
              Official Transaction Audit Voucher
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voucher Content */}
        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* Brand & Seal */}
          <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span className="text-lg font-extrabold text-white">
                  Exness
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                Custody & Liquidity Clearing CEMAC
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded font-semibold inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                AUDITED & CONFIRMED
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">
                Ledger ID: #EXP-LG-{transaction.id.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Amount Display */}
          <div className="text-center py-2 bg-slate-900/60 border border-slate-800/80 rounded-xl">
            <span className="text-xs text-slate-400 uppercase font-medium">Transaction Amount</span>
            <div className="text-3xl font-extrabold text-white font-mono mt-1 tabular-nums">
              +{formatXAF(transaction.amount, true)}
            </div>
            <div className="text-xs text-emerald-400 font-mono mt-1 font-medium">
              {transaction.title}
            </div>
          </div>

          {/* Key Audit Details Grid */}
          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Account Holder:</span>
              <span className="text-white font-semibold">{portfolio.accountHolder}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Portfolio Account:</span>
              <span className="text-slate-200">{portfolio.accountId}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Audit Reference:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">{transaction.reference}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-slate-500 hover:text-slate-300"
                  title="Copy Reference"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Execution Date & Time:</span>
              <span className="text-slate-200">{transaction.date}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Settlement Mechanism:</span>
              <span className="text-slate-200">{transaction.method}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Post-Settlement Balance:</span>
              <span className="text-emerald-400 font-bold">{formatXAF(transaction.balanceAfter)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">6-Month Lock Status:</span>
              <span className="text-amber-400">Compounding Until {portfolio.maturityDate}</span>
            </div>
          </div>

          {/* Description */}
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed">
            <span className="text-[10px] text-slate-500 block uppercase font-mono mb-1">
              Internal Clearance Note
            </span>
            {transaction.description}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Voucher</span>
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
