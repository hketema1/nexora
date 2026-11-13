import test from 'node:test';
import assert from 'node:assert/strict';
import {
  dollarsToCents, formatMoney, monthLabel, summarizeBudgets, budgetShare,
} from '../src/budget-utils.js';

test('converts ordinary amounts to integer cents without floating-point drift', () => {
  assert.equal(dollarsToCents('300'), 30000);
  assert.equal(dollarsToCents('24.5'), 2450);
  assert.equal(dollarsToCents('0.01'), 1);
});

test('rejects malformed, zero, negative and out-of-range dollar amounts', () => {
  for (const amount of ['', '0', '-2', '1.234', 'abc', '1e2', '10000000.01']) {
    assert.equal(dollarsToCents(amount), null, amount);
  }
});

test('summarizes budgets and calculates category shares', () => {
  const values = [{ limit_cents: 30000 }, { limit_cents: 20000 }];
  assert.deepEqual(summarizeBudgets(values), { count: 2, totalCents: 50000 });
  assert.equal(budgetShare(30000, 50000), 60);
  assert.equal(budgetShare(100, 0), 0);
});

test('formats amounts and months for presentation', () => {
  assert.equal(formatMoney(30000), '$300.00');
  assert.equal(monthLabel('2026-11'), 'November 2026');
  assert.equal(monthLabel('2026-13'), '2026-13');
});
