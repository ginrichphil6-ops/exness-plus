import React, { useState } from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  CheckCircle2, 
  FileText, 
  Search, 
  Filter, 
  ExternalLink,
  ShieldCheck,
  Download
} from 'lucide-react';
import { Transaction } from '../types';
import { formatXAF } from '../utils/formatters';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onExportStatement: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onSelectTransaction,
  onExportStatement,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'yield'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering
  const filtered = transactions.filter((tx) => {
    const matchesFilter = filterType === 'all' || tx.type === filterType;
    const matchesSearch =
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.method.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-[#0d1424] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
      {/* Table Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Vault Transaction History & Ledger
            </h2>
            <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
              {transactions.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified ledger audit showing initial capital injection, top-ups, and automated yield accruals
          </p>
        </div>

        {/* Filter controls & Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reference or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900/90 border border-slate-800 focus:border-emerald-500/50 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 outline-none w-48 sm:w-56 transition-colors"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-lg border border-slate-800">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                filterType === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('deposit')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                filterType === 'deposit'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Deposits
            </button>
            <button
              onClick={() => setFilterType('yield')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                filterType === 'yield'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Yields
            </button>
          </div>

          <button
            onClick={onExportStatement}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Download CSV Ledger"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-3">Transaction / Type</th>
              <th className="py-3 px-3">Reference #</th>
              <th className="py-3 px-3">Execution Date</th>
              <th className="py-3 px-3">Channel / Mechanism</th>
              <th className="py-3 px-3 text-right">Amount</th>
              <th className="py-3 px-3 text-right">Vault Balance</th>
              <th className="py-3 px-3 text-center">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 font-mono">
                  No matching transactions located for query "{searchQuery}"
                </td>
              </tr>
            ) : (
              filtered.map((tx) => {
                const isDeposit = tx.type === 'deposit' || tx.type === 'top_up';

                return (
                  <tr
                    key={tx.id}
                    onClick={() => onSelectTransaction(tx)}
                    className="hover:bg-slate-800/30 transition-colors cursor-pointer group"
                  >
                    {/* Title & Icon */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                            isDeposit
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          }`}
                        >
                          {isDeposit ? (
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                            {tx.title}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {tx.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Reference */}
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {tx.reference}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      {tx.date}
                    </td>

                    {/* Method */}
                    <td className="py-3 px-3 text-slate-300">
                      <span className="truncate max-w-[150px] inline-block">
                        {tx.method}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-3 text-right font-mono font-bold whitespace-nowrap tabular-nums">
                      <span
                        className={
                          isDeposit ? 'text-blue-400' : 'text-emerald-400'
                        }
                      >
                        +{formatXAF(tx.amount, true)}
                      </span>
                    </td>

                    {/* Balance After */}
                    <td className="py-3 px-3 text-right font-mono text-slate-300 whitespace-nowrap tabular-nums">
                      {formatXAF(tx.balanceAfter)}
                    </td>

                    {/* Receipt Action */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTransaction(tx);
                        }}
                        className="p-1 rounded text-slate-500 hover:text-emerald-400 hover:bg-slate-800/80 transition-colors"
                        title="View Official Receipt Voucher"
                      >
                        <FileText className="w-4 h-4 mx-auto" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Ledger Footnote */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Immutable Ledger Record · Timestamp Verified on Exness Liquidity Protocol</span>
        </div>
        <span>Showing {filtered.length} of {transactions.length} entries</span>
      </div>
    </div>
  );
};
