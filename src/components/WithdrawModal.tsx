import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  ShieldAlert, 
  CheckCircle2, 
  Bell, 
  Info,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { PortfolioData } from '../types';
import { formatXAF, calculateTimeRemaining } from '../utils/formatters';
import { MATURITY_TIMESTAMP } from '../data/mockData';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: PortfolioData;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  portfolio,
}) => {
  const [countdown, setCountdown] = useState(calculateTimeRemaining(MATURITY_TIMESTAMP));
  const [alertSet, setAlertSet] = useState(false);
  const [showPolicyDetails, setShowPolicyDetails] = useState(false);
  const [attemptWithdrawAmount, setAttemptWithdrawAmount] = useState('');
  const [attemptRejected, setAttemptRejected] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCountdown(calculateTimeRemaining(MATURITY_TIMESTAMP));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAttemptWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptRejected(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#0c1322] border border-amber-600/40 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Warning Stripe */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 h-1.5 w-full" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0e172a]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Vault Withdrawal Interface</span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
                  LOCKED
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Account: {portfolio.accountHolder} · {portfolio.accountId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          {/* Prominent High-Visibility Strict Lock Alert */}
          <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 relative overflow-hidden">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-300 tracking-tight">
                  Withdrawals Strictly Locked Until 6-Month Maturity
                </h4>
                <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
                  Notice for investor <strong>{portfolio.accountHolder}</strong>: To protect your guaranteed 
                  <strong className="text-white font-mono"> 950,000 XAF</strong> projected return (4.75x multiplier on your 200,000 XAF capital), assets are locked in smart liquidity protocols until the complete term expires.
                </p>
              </div>
            </div>
          </div>

          {/* Countdown Clock to Maturity Unlock */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400 mb-2">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>TIME REMAINING UNTIL WITHDRAWAL UNLOCK</span>
            </div>

            <div className="grid grid-cols-4 gap-2 font-mono py-2 max-w-sm mx-auto">
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-2">
                <div className="text-2xl font-extrabold text-white tabular-nums">{countdown.days}</div>
                <div className="text-[10px] text-slate-400 uppercase">Days</div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-2">
                <div className="text-2xl font-extrabold text-white tabular-nums">{String(countdown.hours).padStart(2, '0')}</div>
                <div className="text-[10px] text-slate-400 uppercase">Hours</div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-2">
                <div className="text-2xl font-extrabold text-white tabular-nums">{String(countdown.minutes).padStart(2, '0')}</div>
                <div className="text-[10px] text-slate-400 uppercase">Mins</div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-2">
                <div className="text-2xl font-extrabold text-emerald-400 tabular-nums">{String(countdown.seconds).padStart(2, '0')}</div>
                <div className="text-[10px] text-slate-400 uppercase">Secs</div>
              </div>
            </div>

            <div className="mt-3 inline-flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Unlock Date: <strong>{portfolio.maturityDate}</strong> (00:00 GMT)</span>
            </div>
          </div>

          {/* Portfolio Payout Summary Breakdown */}
          <div className="bg-[#090e18] border border-slate-800 rounded-xl p-4 space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center text-slate-400">
              <span>Principal Deposit:</span>
              <span className="text-white font-semibold">{formatXAF(portfolio.initialDeposit)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Current Accrued Balance:</span>
              <span className="text-emerald-400 font-semibold">{formatXAF(portfolio.currentBalance, true)}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-slate-300">
              <span className="font-sans font-semibold">Total Payout at Unlock ({portfolio.maturityDate}):</span>
              <span className="text-amber-400 text-sm font-bold">{formatXAF(portfolio.projectedReturn)}</span>
            </div>
          </div>

          {/* Test Withdrawal Input (Enforcing strict lock condition) */}
          <form onSubmit={handleAttemptWithdraw} className="space-y-3 pt-1">
            <div className="relative">
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Attempt Withdrawal Request:
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Enter amount (e.g. 200,000 XAF)..."
                  value={attemptWithdrawAmount}
                  onChange={(e) => {
                    setAttemptWithdrawAmount(e.target.value);
                    setAttemptRejected(false);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder:text-slate-500 outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  Request
                </button>
              </div>
            </div>

            {attemptRejected && (
              <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-200 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-bold text-red-300">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Withdrawal Request Blocked: Term Incomplete</span>
                </div>
                <p className="mt-1 text-[11px] text-red-300/80">
                  Contract #EXP-CM-904128 has completed {portfolio.elapsedDays} of 184 days. Full liquidation is disabled until maturity on <strong>{portfolio.maturityDate}</strong>.
                </p>
              </div>
            )}
          </form>

          {/* Maturity Reminder Notification Button */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={() => setAlertSet(true)}
              className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {alertSet ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Maturity Reminder Confirmed</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>Set Maturity Notification</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Acknowledge & Close
            </button>
          </div>

          {/* Contract Guarantee Note */}
          <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-2 border-t border-slate-800/80">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Exness Custodial Guarantee: Your funds remain 100% secure in segregated liquidity nodes.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
