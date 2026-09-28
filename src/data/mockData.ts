import { Transaction, PortfolioData, ChartPoint } from '../types';

export const INITIAL_PORTFOLIO: PortfolioData = {
  accountHolder: 'Mbifong Cornelius',
  accountId: 'EXP-CM-904128',
  tier: 'VIP Platinum Asset Vault',
  currency: 'XAF',
  startDate: 'September 19, 2026',
  maturityDate: 'March 19, 2027',
  totalDurationDays: 181,
  elapsedDays: 9,
  initialDeposit: 200000,
  currentBalance: 238350.50,
  projectedReturn: 950000,
  isTickerActive: true,
};

// Target date timestamp for March 19, 2027 00:00:00 GMT (6-month maturity from Sept 19, 2026)
export const MATURITY_TIMESTAMP = new Date('2027-03-19T00:00:00Z').getTime();

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    reference: 'EXP-DEP-20260919-01',
    type: 'deposit',
    title: 'Initial Capital Investment Deposit',
    amount: 200000,
    date: 'September 19, 2026 · 10:24 AM',
    timestamp: new Date('2026-09-19T10:24:00Z').getTime(),
    status: 'completed',
    method: 'MTN Mobile Money (CEMAC)',
    description: 'Initial principal funding into 6-Month High Yield Fixed Vault under Exness Plus Prime Guarantee.',
    balanceAfter: 200000,
  },
  {
    id: 'tx-002',
    reference: 'EXP-YLD-20260922-04',
    type: 'yield',
    title: 'Day 3 High-Yield Arbitrage Dividend',
    amount: 12400,
    date: 'September 22, 2026 · 11:59 PM',
    timestamp: new Date('2026-09-22T23:59:00Z').getTime(),
    status: 'completed',
    method: 'Automated Smart Contract Distribution',
    description: 'Early cycle compound yield distributed from Exness Liquidity Yield Reserve.',
    balanceAfter: 212400,
  },
  {
    id: 'tx-003',
    reference: 'EXP-YLD-20260925-08',
    type: 'yield',
    title: 'Day 6 Liquidity Pool Distribution',
    amount: 13100,
    date: 'September 25, 2026 · 11:59 PM',
    timestamp: new Date('2026-09-25T23:59:00Z').getTime(),
    status: 'completed',
    method: 'Automated Smart Contract Distribution',
    description: 'Tri-daily performance distribution credited directly to principal base.',
    balanceAfter: 225500,
  },
  {
    id: 'tx-004',
    reference: 'EXP-YLD-20260928-12',
    type: 'yield',
    title: 'Day 9 Real-Time Compounding Distribution',
    amount: 12850.50,
    date: 'September 28, 2026 · 08:30 AM',
    timestamp: new Date('2026-09-28T08:30:00Z').getTime(),
    status: 'completed',
    method: 'Automated Smart Contract Distribution',
    description: 'Automated compounding dividend credit based on active 6-month term rate.',
    balanceAfter: 238350.50,
  },
];

export const CHART_DATA_SERIES: ChartPoint[] = [
  { day: 0, date: 'Sep 19 (Start)', actual: 200000, projected: 200000, label: 'Capital Injection' },
  { day: 3, date: 'Sep 22', actual: 212400, projected: 212000, label: 'Early Accrual' },
  { day: 6, date: 'Sep 25', actual: 225500, projected: 224000, label: 'Liquidity Distribution' },
  { day: 9, date: 'Sep 28 (Today)', actual: 238350, projected: 236000, label: 'Current Valuation' },
  { day: 30, date: 'Oct 19', actual: undefined, projected: 310000, label: 'Month 1 Milestone' },
  { day: 60, date: 'Nov 18', actual: undefined, projected: 430000, label: 'Month 2 Milestone' },
  { day: 90, date: 'Dec 18', actual: undefined, projected: 555000, label: 'Month 3 Target' },
  { day: 120, date: 'Jan 17', actual: undefined, projected: 685000, label: 'Month 4 Target' },
  { day: 150, date: 'Feb 16', actual: undefined, projected: 815000, label: 'Month 5 Target' },
  { day: 181, date: 'Mar 19 (Maturity)', actual: undefined, projected: 950000, label: 'Full 6-Month Maturity' },
];

export const TOP_UP_PRESETS = [
  { amount: 50000, label: '+50,000 XAF', projectedBonus: 237500 },
  { amount: 100000, label: '+100,000 XAF', projectedBonus: 475000 },
  { amount: 200000, label: '+200,000 XAF', projectedBonus: 950000 },
  { amount: 500000, label: '+500,000 XAF', projectedBonus: 2375000 },
];
