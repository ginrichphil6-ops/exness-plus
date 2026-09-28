import React, { useState } from 'react';
import { TrendingUp, Info, HelpCircle, Layers, Calendar } from 'lucide-react';
import { ChartPoint } from '../types';
import { formatXAF } from '../utils/formatters';

interface PerformanceChartProps {
  data: ChartPoint[];
  currentBalance: number;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  currentBalance,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'elapsed' | 'projected'>('all');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // SVG dimensions & padding
  const width = 800;
  const height = 300;
  const padding = { top: 25, right: 30, bottom: 40, left: 65 };

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // Domain values
  const minVal = 150000;
  const maxVal = 1000000;

  // Filter data based on tab
  const filteredData = data.filter((d) => {
    if (activeTab === 'elapsed') return d.actual !== undefined;
    if (activeTab === 'projected') return d.day >= 60;
    return true;
  });

  const getX = (index: number) => {
    return padding.left + (index / (data.length - 1)) * innerWidth;
  };

  const getY = (val: number) => {
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    return padding.top + innerHeight - ((clamped - minVal) / (maxVal - minVal)) * innerHeight;
  };

  // Generate path coordinates for Projected Line (Entire 6-month curve)
  const projectedPoints = data.map((d, i) => `${getX(i)},${getY(d.projected)}`);
  const projectedPath = `M ${projectedPoints.join(' L ')}`;

  // Generate path coordinates for Actual Line (up to day 75)
  const actualItems = data.filter((d) => d.actual !== undefined);
  const actualPoints = actualItems.map((d) => {
    const idx = data.findIndex((item) => item.day === d.day);
    return `${getX(idx)},${getY(d.actual!)}`;
  });
  const actualPath = `M ${actualPoints.join(' L ')}`;

  // Area path for actual growth
  const lastActualIdx = actualItems.length - 1;
  const actualAreaPath = `${actualPath} L ${getX(lastActualIdx)},${height - padding.bottom} L ${getX(0)},${height - padding.bottom} Z`;

  // Grid levels (200k, 400k, 600k, 800k, 1M)
  const yTicks = [200000, 400000, 600000, 800000, 1000000];

  const activePoint = hoverIndex !== null ? data[hoverIndex] : data[5]; // default to current day (day 75)
  const activeX = hoverIndex !== null ? getX(hoverIndex) : getX(5);

  return (
    <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Asset Trajectory & Growth Model
            </h2>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
              High Yield Arbitrage
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Realized compound earnings vs. scheduled 6-month maturity milestone curve (200,000 → 950,000 XAF)
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === 'all'
                ? 'bg-slate-800 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Full 6-Month Term
          </button>
          <button
            onClick={() => setActiveTab('elapsed')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === 'elapsed'
                ? 'bg-slate-800 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Realized (Days 0-75)
          </button>
          <button
            onClick={() => setActiveTab('projected')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              activeTab === 'projected'
                ? 'bg-slate-800 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Projected Horizon
          </button>
        </div>
      </div>

      {/* Legend & Hover Readout */}
      <div className="py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
            <span className="text-slate-300 font-medium">Actual Accrual (Current: {formatXAF(currentBalance)})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 border-t-2 border-dashed border-amber-400" />
            <span className="text-slate-400">Target Trajectory (950,000 XAF at Maturity)</span>
          </div>
        </div>

        {activePoint && (
          <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-lg font-mono">
            <span className="text-slate-400">{activePoint.date}:</span>
            {activePoint.actual ? (
              <span className="text-emerald-400 font-bold">{formatXAF(activePoint.actual)}</span>
            ) : (
              <span className="text-amber-400 font-bold">{formatXAF(activePoint.projected)} (Target)</span>
            )}
            <span className="text-slate-500">· {activePoint.label}</span>
          </div>
        )}
      </div>

      {/* SVG Interactive Chart */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            {/* Emerald Gradient for Actual Area */}
            <linearGradient id="emeraldAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
              <stop offset="70%" stopColor="#10b981" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
            </linearGradient>

            {/* Amber Glow Filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Horizontal Grid lines & Tick Labels */}
          {yTicks.map((val) => {
            const y = getY(val);
            return (
              <g key={val} className="text-slate-600">
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="11"
                  fontFamily="JetBrains Mono"
                >
                  {val >= 1000000 ? '1.0M' : `${val / 1000}k`}
                </text>
              </g>
            );
          })}

          {/* Projected Target Curve (Dashed Amber/Gold) */}
          {(activeTab === 'all' || activeTab === 'projected') && (
            <path
              d={projectedPath}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeDasharray="5 5"
              strokeOpacity="0.85"
            />
          )}

          {/* Actual Accrual Area (Gradient fill) */}
          {(activeTab === 'all' || activeTab === 'elapsed') && (
            <path d={actualAreaPath} fill="url(#emeraldAreaGrad)" />
          )}

          {/* Actual Accrual Curve (Solid Emerald) */}
          {(activeTab === 'all' || activeTab === 'elapsed') && (
            <path
              d={actualPath}
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              filter="url(#glow)"
            />
          )}

          {/* X Axis Labels */}
          {data.map((d, i) => {
            // Show every 2nd label to avoid crowding on mobile
            if (i % 2 !== 0 && i !== data.length - 1) return null;
            const x = getX(i);
            return (
              <g key={d.day}>
                <text
                  x={x}
                  y={height - padding.bottom + 22}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="11"
                  fontFamily="JetBrains Mono"
                >
                  {d.date.split(' ')[0]}
                </text>
                <circle
                  cx={x}
                  cy={height - padding.bottom}
                  r="2"
                  fill="#334155"
                />
              </g>
            );
          })}

          {/* Actual points markers */}
          {data.map((d, i) => {
            const x = getX(i);
            const isActual = d.actual !== undefined;
            const y = getY(isActual ? d.actual! : d.projected);

            return (
              <g
                key={d.day}
                className="cursor-pointer group"
                onMouseEnter={() => setHoverIndex(i)}
                onClick={() => setHoverIndex(i)}
              >
                {/* Hit area */}
                <rect
                  x={x - 18}
                  y={padding.top}
                  width="36"
                  height={innerHeight}
                  fill="transparent"
                />

                {/* Point circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={hoverIndex === i ? 6 : (isActual ? 4 : 3)}
                  fill={isActual ? '#10b981' : '#f59e0b'}
                  stroke="#0b1120"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />
              </g>
            );
          })}

          {/* Hover Crosshair Line */}
          {hoverIndex !== null && (
            <g pointerEvents="none">
              <line
                x1={activeX}
                y1={padding.top}
                x2={activeX}
                y2={height - padding.bottom}
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle
                cx={activeX}
                cy={getY(activePoint.actual ?? activePoint.projected)}
                r="7"
                fill="#ffffff"
                stroke={activePoint.actual ? '#10b981' : '#f59e0b'}
                strokeWidth="3"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Chart Footer Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-800/80 text-xs">
        <div>
          <span className="text-slate-500 block mb-0.5">Average Daily Accrual</span>
          <span className="font-mono text-emerald-400 font-bold text-sm">~4,166 XAF / day</span>
        </div>
        <div>
          <span className="text-slate-500 block mb-0.5">Yield Frequency</span>
          <span className="font-mono text-white font-medium text-sm">Real-Time Compound</span>
        </div>
        <div>
          <span className="text-slate-500 block mb-0.5">Final Milestone ROI</span>
          <span className="font-mono text-amber-400 font-bold text-sm">+375.00% Net</span>
        </div>
        <div>
          <span className="text-slate-500 block mb-0.5">Risk Mitigation</span>
          <span className="text-slate-300 font-medium text-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            100% Capital Guaranteed
          </span>
        </div>
      </div>
    </div>
  );
};
