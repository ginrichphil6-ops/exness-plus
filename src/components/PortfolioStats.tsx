import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  Target, 
  Clock, 
  Lock, 
  ArrowUpRight, 
  Activity, 
  Calendar,
  Sparkles,
  Pause,
  Play
} from 'lucide-react';
import { PortfolioData } from '../types';
import { formatXAF, calculateTimeRemaining } from '../utils/formatters';
import { MATURITY_TIMESTAMP } from '../data/mockData';

interface PortfolioStatsProps {
  portfolio: PortfolioData;
  isTickerActive: boolean;
  onToggleTicker: () => void;
  onOpenWithdraw: () => void;
  onOpenInvest: () => void;
}

export const PortfolioStats: React.FC<PortfolioStatsProps> = ({
  portfolio,
  isTickerActive,
  onToggleTicker,
  onOpenWithdraw,
  onOpenInvest,
}) => {
  const [countdown, setCountdown] = useState(calculateTimeRemaining(MATURITY_TIMESTAMP));
  const [pulse, setPulse] = useState(false);

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateTimeRemaining(MATURITY_TIMESTAMP));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Visual pulse indicator when ticker increments
  useEffect(() => {
    setPulse(true);
    const timeout = setTimeout(() => setPulse(false), 800);
    return () => clearTimeout(timeout);
  }, [portfolio.currentBalance]);

  // Calculations
  const totalGainXAF = portfolio.currentBalance - portfolio.initialDeposit;
  const currentROI = (totalGainXAF / portfolio.initialDeposit) * 100;
  const projectedTotalGain = portfolio.projectedReturn - portfolio.initialDeposit;
  const projectedROI = (projectedTotalGain / portfolio.initialDeposit) * 100;
  const progressPercent = Math.min(100, Math.max(0, (portfolio.elapsedDays / portfolio.totalDurationDays) * 100));

  return (
    <div className="space-y-6">
      {/* Top Banner / Investor Welcome Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0e172e] to-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Glow Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE ASSET PORTFOLIO ACTIVE</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">EXNESS PRIME GUARANTEED YIELD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-200">{portfolio.accountHolder}</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Your 6-month capital compounding contract is actively accruing compound yield. All returns are backed by Exness Plus automated liquidity reserves.
            </p>
          </div>

          {/* Quick Actions & Live Stream Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onToggleTicker}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                isTickerActive
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/60'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
              title="Toggle Live Progressive Growth Simulation"
            >
              {isTickerActive ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Accrual Stream Active</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-slate-400" />
                  <span>Resume Stream</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenInvest}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              <span>Boost Yield</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Financial Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Current Portfolio Value / Balance (Live-Updating Progressive Ticker) */}
        <div className={`bg-[#0d1424] border transition-all duration-300 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 ${
          pulse ? 'border-emerald-500/60 shadow-emerald-950/30' : 'border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Current Portfolio Value
            </span>
            <div className="flex items-center gap-1.5 bg-emerald-950/40 text-emerald-400 border border-emerald-800/30 px-2 py-0.5 rounded-md text-[11px] font-mono">
              <Activity className={`w-3 h-3 text-emerald-400 ${isTickerActive ? 'animate-pulse' : ''}`} />
              <span>Live Accrual</span>
            </div>
          </div>

          <div className="mt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
                {formatXAF(portfolio.currentBalance, true)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mt-2.5 text-xs">
              <span className="inline-flex items-center font-semibold font-mono text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 rounded">
                +{currentROI.toFixed(2)}%
              </span>
              <span className="text-slate-400">
                (+{formatXAF(totalGainXAF)} earned)
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Accrual Pace:</span>
            <span className="font-mono text-emerald-300 font-medium">~4,166 XAF / day</span>
          </div>
        </div>

        {/* Card 2: Total Invested Capital */}
        <div className="bg-[#0d1424] border border-slate-800 hover:border-slate-700 transition-all rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Invested Capital
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              {formatXAF(portfolio.initialDeposit)}
            </div>
            
            <div className="flex items-center gap-2 mt-2.5 text-xs text-slate-400">
              <span>Principal Deposit:</span>
              <span className="font-mono text-slate-300 font-medium">{portfolio.startDate}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Status:</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              100% Capital Protected
            </span>
          </div>
        </div>

        {/* Card 3: Projected Return (at 6 months) */}
        <div className="bg-[#0d1424] border border-slate-800 hover:border-amber-600/40 transition-all rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Projected Return (6 Months)
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Target className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums tracking-tight">
              {formatXAF(portfolio.projectedReturn)}
            </div>
            
            <div className="flex items-center gap-2 mt-2.5 text-xs">
              <span className="inline-flex items-center font-bold font-mono text-amber-300 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40">
                4.75x Multiplier
              </span>
              <span className="text-slate-400">
                (+{projectedROI.toFixed(0)}% Net ROI)
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Target Profit:</span>
            <span className="font-mono text-amber-300/90 font-medium">+{formatXAF(projectedTotalGain)}</span>
          </div>
        </div>

        {/* Card 4: Investment Progress Tracker (6-Month Maturity Countdown) */}
        <div className="bg-[#0d1424] border border-slate-800 hover:border-slate-700 transition-all rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Term Maturity Tracker
            </span>
            <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Maturity Lock</span>
            </div>
          </div>

          {/* Countdown Clock Display */}
          <div className="mt-1">
            <div className="grid grid-cols-4 gap-1.5 text-center font-mono py-1">
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-1.5">
                <div className="text-base sm:text-lg font-bold text-white tabular-nums">{countdown.days}</div>
                <div className="text-[9px] text-slate-500 uppercase">Days</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-1.5">
                <div className="text-base sm:text-lg font-bold text-white tabular-nums">{String(countdown.hours).padStart(2, '0')}</div>
                <div className="text-[9px] text-slate-500 uppercase">Hours</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-1.5">
                <div className="text-base sm:text-lg font-bold text-white tabular-nums">{String(countdown.minutes).padStart(2, '0')}</div>
                <div className="text-[9px] text-slate-500 uppercase">Mins</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-1.5">
                <div className="text-base sm:text-lg font-bold text-emerald-400 tabular-nums">{String(countdown.seconds).padStart(2, '0')}</div>
                <div className="text-[9px] text-slate-500 uppercase">Secs</div>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>6-Month Completion</span>
                <span className="font-mono text-emerald-400 font-semibold">{progressPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Unlock Date:</span>
            <span className="font-mono text-slate-200 font-medium">{portfolio.maturityDate}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
