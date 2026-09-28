import React from 'react';
import { ShieldCheck, Layers, Award, CheckCircle, ExternalLink, Lock } from 'lucide-react';
import { PortfolioData } from '../types';
import { formatXAF } from '../utils/formatters';

interface PortfolioBreakdownProps {
  portfolio: PortfolioData;
}

export const PortfolioBreakdown: React.FC<PortfolioBreakdownProps> = ({ portfolio }) => {
  const allocations = [
    { name: 'Exness Prime Liquidity Node', share: 60, amount: portfolio.currentBalance * 0.60, color: 'bg-emerald-500' },
    { name: 'High-Yield Arbitrage Clearing', share: 25, amount: portfolio.currentBalance * 0.25, color: 'bg-amber-400' },
    { name: 'CEMAC Hedged Reserve Pool', share: 15, amount: portfolio.currentBalance * 0.15, color: 'bg-blue-400' },
  ];

  const milestones = [
    { month: 'Day 9 (Today)', label: 'Current Progress', target: Math.round(portfolio.currentBalance), status: 'current', date: 'Sep 28, 2026' },
    { month: 'Month 1', label: 'Initial Ramp-Up', target: 310000, status: 'upcoming', date: 'Oct 19, 2026' },
    { month: 'Month 3', label: 'Acceleration Phase', target: 555000, status: 'upcoming', date: 'Dec 18, 2026' },
    { month: 'Month 6', label: 'Full Vault Maturity', target: portfolio.projectedReturn, status: 'maturity', date: portfolio.maturityDate },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Allocation breakdown */}
      <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Vault Asset Allocation
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">100% Deployed</span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="mt-4">
          <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden flex">
            {allocations.map((item) => (
              <div
                key={item.name}
                className={`h-full ${item.color}`}
                style={{ width: `${item.share}%` }}
                title={`${item.name}: ${item.share}%`}
              />
            ))}
          </div>
        </div>

        {/* Allocation List */}
        <div className="mt-4 space-y-3">
          {allocations.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="text-slate-300 font-medium">{item.name}</span>
              </div>
              <div className="text-right font-mono">
                <span className="text-white font-bold">{formatXAF(item.amount)}</span>
                <span className="text-slate-500 ml-1.5">({item.share}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contract Milestones */}
      <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-5 shadow-xl lg:col-span-2">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              6-Month Compounding Milestones
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
            Fixed 4.75x Guarantee
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
          {milestones.map((m) => {
            const isMaturity = m.status === 'maturity';
            const isCurrent = m.status === 'current';
            const isAchieved = m.status === 'achieved';

            return (
              <div
                key={m.month}
                className={`p-3.5 rounded-xl border font-mono transition-all ${
                  isMaturity
                    ? 'bg-amber-950/20 border-amber-500/50 shadow-md shadow-amber-950/20'
                    : isCurrent
                    ? 'bg-emerald-950/20 border-emerald-500/60'
                    : isAchieved
                    ? 'bg-slate-900/80 border-slate-800'
                    : 'bg-slate-900/40 border-slate-800/60 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400 font-sans">{m.month}</span>
                  {isMaturity ? (
                    <Lock className="w-3 h-3 text-amber-400" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ) : (
                    <CheckCircle className="w-3 h-3 text-slate-500" />
                  )}
                </div>

                <div className={`text-base font-extrabold ${
                  isMaturity ? 'text-amber-400' : isCurrent ? 'text-emerald-400' : 'text-slate-200'
                }`}>
                  {formatXAF(m.target)}
                </div>

                <div className="text-[11px] font-sans text-slate-400 mt-1">
                  {m.label}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {m.date}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
