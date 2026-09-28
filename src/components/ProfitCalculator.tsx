import React, { useState } from 'react';
import { Calculator, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { formatXAF } from '../utils/formatters';

interface ProfitCalculatorProps {
  onInvestAmount: (amount: number) => void;
}

export const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({ onInvestAmount }) => {
  const [calcCapital, setCalcCapital] = useState<number>(200000);
  const [termMonths, setTermMonths] = useState<number>(6);

  // Return calculation formula:
  // 6 months = 4.75x (950,000 for 200,000)
  // 12 months = 10.5x
  const multiplier = termMonths === 6 ? 4.75 : 10.5;
  const projectedReturn = calcCapital * multiplier;
  const netProfit = projectedReturn - calcCapital;
  const roiPercent = ((projectedReturn - calcCapital) / calcCapital) * 100;

  return (
    <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Exness Plus Yield Simulator
            </h3>
            <p className="text-xs text-slate-400">
              Calculate projected earnings on custom capital allocations
            </p>
          </div>
        </div>

        {/* Term Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setTermMonths(6)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              termMonths === 6
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            6-Month Vault (4.75x)
          </button>
          <button
            onClick={() => setTermMonths(12)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              termMonths === 12
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            12-Month Extended (10.5x)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-5 items-center">
        {/* Slider & Input Controls */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold uppercase tracking-wider">
              Simulated Capital Amount:
            </span>
            <span className="font-mono text-base font-bold text-white bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
              {formatXAF(calcCapital)}
            </span>
          </div>

          <input
            type="range"
            min="50000"
            max="2000000"
            step="25000"
            value={calcCapital}
            onChange={(e) => setCalcCapital(Number(e.target.value))}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />

          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>50,000 XAF</span>
            <span>500,000 XAF</span>
            <span>1,000,000 XAF</span>
            <span>2,000,000 XAF</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {[100000, 200000, 500000, 1000000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCalcCapital(preset)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all ${
                  calcCapital === preset
                    ? 'bg-slate-800 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {formatXAF(preset)}
              </button>
            ))}
          </div>
        </div>

        {/* Projected Yield Readout Box */}
        <div className="md:col-span-5 bg-gradient-to-br from-slate-900 via-[#0f192d] to-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Projected Total Return ({termMonths} Months)
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono mt-1 tabular-nums">
            {formatXAF(projectedReturn)}
          </div>

          <div className="flex items-center justify-center gap-2 mt-2 text-xs">
            <span className="font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
              +{formatXAF(netProfit)} Profit
            </span>
            <span className="text-slate-400 font-mono">
              (+{roiPercent.toFixed(0)}% ROI)
            </span>
          </div>

          <button
            onClick={() => onInvestAmount(calcCapital)}
            className="mt-4 w-full py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Proceed with {formatXAF(calcCapital)}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
