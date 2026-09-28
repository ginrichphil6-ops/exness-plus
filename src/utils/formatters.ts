export function formatXAF(amount: number, showDecimals: boolean = false): string {
  if (showDecimals) {
    return (
      new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount) + ' XAF'
    );
  }
  return (
    new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(Math.round(amount)) + ' XAF'
  );
}

export function formatPercent(val: number): string {
  return `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;
}

export function calculateTimeRemaining(targetDateTimestamp: number) {
  const now = Date.now();
  const diff = Math.max(0, targetDateTimestamp - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, totalMs: diff };
}
