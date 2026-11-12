import { useEffect, useState } from 'react';
import { createBudget, listBudgets } from './api.js';
import {
  budgetShare, currentMonth, dollarsToCents, formatMoney, monthLabel, summarizeBudgets,
} from './budget-utils.js';

const CATEGORIES = [
  { name: 'Housing', icon: '⌂', tone: 'violet' },
  { name: 'Groceries', icon: '◈', tone: 'mint' },
  { name: 'Transportation', icon: '↗', tone: 'blue' },
  { name: 'Utilities', icon: '✦', tone: 'orange' },
  { name: 'Dining', icon: '☕', tone: 'pink' },
  { name: 'Entertainment', icon: '♫', tone: 'purple' },
  { name: 'Subscriptions', icon: '▣', tone: 'sky' },
  { name: 'Savings', icon: '↥', tone: 'green' },
  { name: 'Other', icon: '••', tone: 'gray' },
];

function categoryMeta(category) {
  return CATEGORIES.find((item) => item.name === category)
    || { name: category, icon: '◈', tone: 'gray' };
}

function Icon({ name, size = 20 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
    'aria-hidden': true };
  if (name === 'wallet') return <svg {...common}><rect x="3" y="6" width="18" height="15" rx="3"/><path d="M3 10h18M6 6V4a2 2 0 0 1 2-2h10"/></svg>;
  if (name === 'calendar') return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></svg>;
  if (name === 'plus') return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
  if (name === 'arrow') return <svg {...common}><path d="m5 12 14 0m-6-6 6 6-6 6"/></svg>;
  if (name === 'shield') return <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>;
  if (name === 'refresh') return <svg {...common}><path d="M20 11a8 8 0 0 0-14-5L4 8m0-5v5h5M4 13a8 8 0 0 0 14 5l2-2m0 5v-5h-5"/></svg>;
  return null;
}

export default function App() {
  const [month, setMonth] = useState(currentMonth);
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState('Groceries');
  const [amount, setAmount] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError('');
    listBudgets(month)
      .then((items) => {
        if (!active) return;
        setBudgets(items);
      })
      .catch((error) => {
        if (!active) return;
        setLoadError(error.message);
        setBudgets([]);
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [month, refresh]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (saving) return;
    setFormError('');
    setNotice('');
    const limitCents = dollarsToCents(amount);
    if (limitCents === null) {
      setFormError('Enter an amount above $0 with no more than two decimal places.');
      return;
    }

    setSaving(true);
    try {
      await createBudget({ month, category, limit_cents: limitCents });
      setAmount('');
      setNotice(category + ' budget saved successfully.');
      setRefresh((n) => n + 1);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSaving(false);
    }
  }

  const { count, totalCents } = summarizeBudgets(budgets);
  const orderedBudgets = [...budgets].sort((a, b) => b.limit_cents - a.limit_cents);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">N</span><span>NEXORA<span className="brand-dot">.</span></span></div>
        <p className="sidebar-label">WORKSPACE</p>
        <div className="nav-item active"><Icon name="wallet" size={19} /> Budget overview</div>
        <div className="sidebar-bottom">
          <span className="env-dot" /> LOCAL PROTOTYPE
          <p>Planning your finances, one category at a time.</p>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <span>Personal finance <span className="breadcrumb">/ Budgets</span></span>
          <div className="topbar-right"><span className="prototype-label">SINGLE-USER DEMO</span><span className="avatar">NX</span></div>
        </header>

        <main className="content">
          <div className="page-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> FINANCIAL CLARITY STARTS HERE</div>
              <h1>Budget overview<span className="accent">.</span></h1>
              <p className="muted">A clearer way to plan your money, month by month.</p>
            </div>
            <label className="month-picker">
              <Icon name="calendar" size={18} />
              <span className="sr-only">Choose budget month</span>
              <input aria-label="Choose budget month" type="month" value={month}
                onChange={(event) => { setMonth(event.target.value); setNotice(''); setFormError(''); }} />
            </label>
          </div>

          <div className="prototype-warning" role="note">
            <Icon name="shield" size={19} />
            <span><strong>Prototype mode:</strong> Enter sample budgets only. No user accounts, bank connections, or secure financial data storage yet.</span>
          </div>

          <section className="metrics" aria-label="Monthly budget summary">
            <div className="metric-card primary">
              <div className="metric-header"><span>MONTHLY BUDGET PLAN</span><span className="metric-symbol">↗</span></div>
              <div className="metric-amount">{formatMoney(totalCents)}</div>
              <div className="metric-sub">Total allocated in {monthLabel(month)}</div>
              <div className="metric-decoration" aria-hidden="true" />
            </div>
            <div className="metric-card secondary">
              <div className="metric-header"><span>ACTIVE CATEGORIES</span><span className="tiny-icon"><Icon name="wallet" size={19}/></span></div>
              <div className="metric-amount">{count.toString().padStart(2, '0')}</div>
              <div className="metric-sub">Categories with a saved budget</div>
            </div>
            <div className="metric-card secondary">
              <div className="metric-header"><span>PLAN PERIOD</span><span className="tiny-icon"><Icon name="calendar" size={19}/></span></div>
              <div className="metric-month">{monthLabel(month)}</div>
              <div className="metric-sub">Switch months to review your plans</div>
            </div>
          </section>

          <div className="workspace-grid">
            <section className="panel allocations" aria-labelledby="allocation-heading">
              <div className="panel-top">
                <div><div className="section-kicker">YOUR BREAKDOWN</div><h2 id="allocation-heading">Budget allocations</h2></div>
                <button className="refresh-btn" onClick={() => setRefresh((n) => n + 1)}
                  aria-label="Refresh saved budgets" title="Refresh budgets"><Icon name="refresh" size={19}/></button>
              </div>
              <p className="panel-description">See how your planned amounts are divided across categories.</p>

              {loadError && <div className="alert error" role="alert">{loadError}</div>}
              {loading ? <div className="empty-state" role="status">Loading budgets…</div>
                : !loadError && orderedBudgets.length === 0
                  ? <div className="empty-state">
                      <div className="empty-icon"><Icon name="wallet" size={27}/></div>
                      <strong>No budgets yet</strong>
                      <span>Start by adding a category for {monthLabel(month)}.</span>
                    </div>
                  : !loadError && <div className="budget-list">
                      {orderedBudgets.map((budget) => {
                        const meta = categoryMeta(budget.category);
                        const share = budgetShare(budget.limit_cents, totalCents);
                        return (
                          <div className="budget-row" key={budget.id}>
                            <div className="category-icon" data-tone={meta.tone} aria-hidden="true">{meta.icon}</div>
                            <div className="category-detail">
                              <div className="budget-title-row"><strong>{budget.category}</strong><span>{formatMoney(budget.limit_cents)}</span></div>
                              <div className="progress-track"><div className="progress-fill" data-tone={meta.tone} style={{ width: share + '%' }}/></div>
                              <div className="budget-percentage">{share}% of your monthly plan</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
              }
            </section>

            <section className="panel new-budget" aria-labelledby="new-budget-heading">
              <div className="section-kicker">BUILD YOUR PLAN</div>
              <h2 id="new-budget-heading">Add a budget</h2>
              <p className="panel-description">Give your money a purpose, one category at a time.</p>
              <form onSubmit={handleSubmit}>
                <label className="field"><span>Category</span>
                  <select value={category} onChange={(event) => setCategory(event.target.value)} disabled={saving}>
                    {CATEGORIES.map((item) => <option value={item.name} key={item.name}>{item.name}</option>)}
                  </select>
                </label>
                <label className="field"><span>Monthly limit</span>
                  <div className="money-input"><span className="dollar-sign">$</span>
                    <input value={amount} onChange={(event) => setAmount(event.target.value)}
                      placeholder="0.00" inputMode="decimal" required disabled={saving} aria-label="Monthly limit in dollars" />
                    <span className="currency">USD</span>
                  </div>
                </label>
                <div className="period-note"><Icon name="calendar" size={16}/> Saving to <strong>{monthLabel(month)}</strong></div>
                {formError && <div className="alert error" role="alert">{formError}</div>}
                {notice && <div className="alert success" role="status">{notice}</div>}
                <button className="submit-btn" disabled={saving} type="submit">
                  <Icon name="plus" size={19}/> {saving ? 'Saving…' : 'Add budget'} <span><Icon name="arrow" size={17}/></span>
                </button>
              </form>
              <div className="form-tip"><span className="tip-icon">✦</span><span>Tip: Budgets are saved in your local database and appear in the list immediately.</span></div>
            </section>
          </div>
          <footer>© NEXORA · INST347 Cloud Computing · Development prototype</footer>
        </main>
      </div>
    </div>
  );
}
