import React from 'react';
import { 
  TrendingUp, 
  Lock, 
  PlusCircle, 
  ShieldCheck, 
  FileText,
  UserCheck
} from 'lucide-react';
import { PortfolioData } from '../types';

interface HeaderProps {
  portfolio: PortfolioData;
  onOpenInvest: () => void;
  onOpenWithdraw: () => void;
  onExportStatement: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  portfolio,
  onOpenInvest,
  onOpenWithdraw,
  onExportStatement,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-[#0b1120]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand & Account Zone */}
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            {/* Exness Plus Brand */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-emerald-500 to-teal-700 p-[1.5px] shadow-lg shadow-emerald-950/40">
                <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-sans">
                    Exness <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">Plus</span>
                  </span>
                </div>
                <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase">
                  Prime Yield Vault
                </span>
              </div>
            </div>

            {/* Subtle Divider */}
            <div className="hidden md:block h-8 w-px bg-slate-800" />

            {/* Account Holder Prominent Badge */}
            <div className="hidden sm:flex items-center gap-3 bg-slate-900/90 border border-slate-800/90 rounded-xl px-3.5 py-1.5 shadow-inner">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                MC
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Investor:</span>
                  <span className="text-sm font-semibold text-white tracking-tight truncate max-w-[160px] lg:max-w-none">
                    {portfolio.accountHolder}
                  </span>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-label="Verified Investor" />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>{portfolio.accountId}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-amber-400/90 font-medium">6M Fixed Term</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Zone */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Export Statement */}
            <button
              onClick={onExportStatement}
              className="hidden lg:flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg transition-all whitespace-nowrap active:scale-[0.98]"
              title="Download Portfolio Statement"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Statement</span>
            </button>

            {/* Top Up / Invest Button */}
            <button
              onClick={onOpenInvest}
              className="group flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg shadow-md shadow-emerald-950/50 hover:shadow-emerald-900/60 transition-all transform active:scale-[0.98] whitespace-nowrap cursor-pointer border border-emerald-400/30"
            >
              <PlusCircle className="w-4 h-4 text-emerald-100 group-hover:rotate-90 transition-transform duration-300" />
              <span>Invest / Top Up</span>
            </button>

            {/* Withdraw Button (Strict Lock Condition Enforced) */}
            <button
              onClick={onOpenWithdraw}
              className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-amber-200/90 bg-amber-950/20 hover:bg-amber-950/40 border border-amber-600/30 hover:border-amber-500/50 rounded-lg transition-all active:scale-[0.98] whitespace-nowrap cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Withdraw</span>
            </button>
          </div>

        </div>

        {/* Mobile View Account Holder Bar */}
        <div className="sm:hidden pb-3 pt-1 flex items-center justify-between border-t border-slate-800/40">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Account:</span>
            <span className="font-semibold text-white">{portfolio.accountHolder}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-[11px] font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
            6-Month Maturity Vault
          </span>
        </div>
      </div>
    </header>
  );
};
