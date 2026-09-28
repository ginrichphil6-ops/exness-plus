import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  Download, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  Lock,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { Header } from './components/Header';
import { PortfolioStats } from './components/PortfolioStats';
import { PerformanceChart } from './components/PerformanceChart';
import { TransactionHistory } from './components/TransactionHistory';
import { InvestModal } from './components/InvestModal';
import { WithdrawModal } from './components/WithdrawModal';
import { ReceiptModal } from './components/ReceiptModal';
import { PortfolioBreakdown } from './components/PortfolioBreakdown';
import { ProfitCalculator } from './components/ProfitCalculator';
import { 
  INITIAL_PORTFOLIO, 
  INITIAL_TRANSACTIONS, 
  CHART_DATA_SERIES 
} from './data/mockData';
import { PortfolioData, Transaction, ChartPoint } from './types';
import { formatXAF } from './utils/formatters';

export default function App() {
  // Load state from localStorage or use defaults
  const [portfolio, setPortfolio] = useState<PortfolioData>(() => {
    const saved = localStorage.getItem('exness_plus_portfolio_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.startDate === INITIAL_PORTFOLIO.startDate) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    // Clean up old cached v1
    localStorage.removeItem('exness_plus_portfolio');
    return INITIAL_PORTFOLIO;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('exness_plus_transactions_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length && parsed[parsed.length - 1].reference.includes('20260919')) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.removeItem('exness_plus_transactions');
    return INITIAL_TRANSACTIONS;
  });

  const [chartData, setChartData] = useState<ChartPoint[]>(CHART_DATA_SERIES);
  const [isTickerActive, setIsTickerActive] = useState<boolean>(true);

  // Modals
  const [isInvestOpen, setIsInvestOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('exness_plus_portfolio_v2', JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem('exness_plus_transactions_v2', JSON.stringify(transactions));
  }, [transactions]);

  // Live progressive ticker simulation: small compound accrual increments every 3s
  useEffect(() => {
    if (!isTickerActive) return;

    const interval = setInterval(() => {
      // Add between 0.12 and 0.45 XAF
      const microYield = parseFloat((Math.random() * 0.33 + 0.12).toFixed(2));

      setPortfolio((prev) => ({
        ...prev,
        currentBalance: parseFloat((prev.currentBalance + microYield).toFixed(2)),
      }));
    }, 2800);

    return () => clearInterval(interval);
  }, [isTickerActive]);

  // Handle Top-Up Deposit confirmation
  const handleConfirmDeposit = (amount: number, method: string) => {
    const newDepositTotal = portfolio.initialDeposit + amount;
    const newCurrentBalance = portfolio.currentBalance + amount;
    const newProjectedReturn = newDepositTotal * 4.75;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      reference: `EXP-TOP-${Date.now().toString().slice(-6)}`,
      type: 'top_up',
      title: 'Additional Vault Capital Top-Up',
      amount,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      timestamp: Date.now(),
      status: 'completed',
      method,
      description: `Principal increase credited directly into Mbifong Cornelius's 6-month compounding contract.`,
      balanceAfter: newCurrentBalance,
    };

    setPortfolio((prev) => ({
      ...prev,
      initialDeposit: newDepositTotal,
      currentBalance: newCurrentBalance,
      projectedReturn: newProjectedReturn,
    }));

    setTransactions((prev) => [newTx, ...prev]);

    // Show toast
    showToast(`Successfully deposited ${formatXAF(amount)} via ${method}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleResetData = () => {
    if (confirm('Reset portfolio back to initial state (200,000 XAF deposit on September 19, 2026)?')) {
      localStorage.removeItem('exness_plus_portfolio');
      localStorage.removeItem('exness_plus_transactions');
      localStorage.removeItem('exness_plus_portfolio_v2');
      localStorage.removeItem('exness_plus_transactions_v2');
      setPortfolio(INITIAL_PORTFOLIO);
      setTransactions(INITIAL_TRANSACTIONS);
      showToast('Portfolio reset to initial verified balance.');
    }
  };

  const handleExportStatement = () => {
    // Generate CSV
    const headers = ['Reference', 'Title', 'Date', 'Type', 'Method', 'Amount (XAF)', 'Balance After (XAF)'];
    const rows = transactions.map((t) => [
      t.reference,
      `"${t.title}"`,
      `"${t.date}"`,
      t.type,
      `"${t.method}"`,
      t.amount,
      t.balanceAfter,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ExnessPlus_Statement_${portfolio.accountHolder.replace(' ', '_')}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Ledger statement downloaded in CSV format.');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/60 shadow-xl shadow-emerald-950/40 text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-medium animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        portfolio={portfolio}
        onOpenInvest={() => setIsInvestOpen(true)}
        onOpenWithdraw={() => setIsWithdrawOpen(true)}
        onExportStatement={handleExportStatement}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* Section 1: Portfolio Stats, Live Ticker, and Countdown Tracker */}
        <PortfolioStats
          portfolio={portfolio}
          isTickerActive={isTickerActive}
          onToggleTicker={() => setIsTickerActive((prev) => !prev)}
          onOpenWithdraw={() => setIsWithdrawOpen(true)}
          onOpenInvest={() => setIsInvestOpen(true)}
        />

        {/* Section 2: Asset Performance Chart (Projected vs. Actual Growth) */}
        <PerformanceChart
          data={chartData}
          currentBalance={portfolio.currentBalance}
        />

        {/* Section 3: Portfolio Asset Allocation & Compounding Milestones */}
        <PortfolioBreakdown portfolio={portfolio} />

        {/* Section 4: Recent Transaction History Table */}
        <TransactionHistory
          transactions={transactions}
          onSelectTransaction={(tx) => setSelectedReceiptTx(tx)}
          onExportStatement={handleExportStatement}
        />

        {/* Section 5: Interactive Yield & Growth Calculator */}
        <ProfitCalculator
          onInvestAmount={(amt) => {
            setIsInvestOpen(true);
          }}
        />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070b12] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Exness Plus</span>
            <span>·</span>
            <span>Tier-1 Regulated Digital Asset Vault</span>
            <span>·</span>
            <span className="text-slate-400">Account: {portfolio.accountHolder}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetData}
              className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
              title="Reset state to initial 200,000 XAF"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset State</span>
            </button>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>256-Bit SSL Custody</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <InvestModal
        isOpen={isInvestOpen}
        onClose={() => setIsInvestOpen(false)}
        onConfirmDeposit={handleConfirmDeposit}
        currentDeposit={portfolio.initialDeposit}
      />

      <WithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        portfolio={portfolio}
      />

      <ReceiptModal
        transaction={selectedReceiptTx}
        portfolio={portfolio}
        onClose={() => setSelectedReceiptTx(null)}
      />
    </div>
  );
}
