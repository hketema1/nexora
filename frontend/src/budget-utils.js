export function currentMonth() {
  const date = new Date();
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
}

export function monthLabel(month) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return month;
  const [year, number] = month.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(year, number - 1, 1)));
}

// Parse dollars as a string, never as a floating-point amount.
export function dollarsToCents(input) {
  if (typeof input !== 'string' || !/^\d+(\.\d{1,2})?$/.test(input.trim())) return null;
  const [dollars, cents = ''] = input.trim().split('.');
  const value = Number(dollars) * 100 + Number(cents.padEnd(2, '0'));
  if (!Number.isSafeInteger(value) || value <= 0 || value > 1_000_000_000) return null;
  return value;
}

export function formatMoney(cents) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function summarizeBudgets(budgets) {
  const totalCents = budgets.reduce((sum, budget) => sum + budget.limit_cents, 0);
  return { count: budgets.length, totalCents };
}

export function budgetShare(limitCents, totalCents) {
  return totalCents ? Math.round((limitCents / totalCents) * 100) : 0;
}
