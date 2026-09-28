export interface Transaction {
  id: string;
  reference: string;
  type: 'deposit' | 'yield' | 'top_up';
  title: string;
  amount: number;
  date: string;
  timestamp: number;
  status: 'completed' | 'locked' | 'processing';
  method: string;
  description: string;
  balanceAfter: number;
}

export interface PortfolioData {
  accountHolder: string;
  accountId: string;
  tier: string;
  currency: string;
  startDate: string;
  maturityDate: string;
  totalDurationDays: number;
  elapsedDays: number;
  initialDeposit: number;
  currentBalance: number;
  projectedReturn: number;
  isTickerActive: boolean;
}

export interface ChartPoint {
  day: number;
  date: string;
  actual?: number;
  projected: number;
  label: string;
}
