// The Vite dev proxy maps /api to the local FastAPI server.
// For other hosting arrangements, set VITE_API_BASE_URL at build time.
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(API_BASE + path, {
      ...options,
      headers: { Accept: 'application/json', ...options.headers },
    });
  } catch {
    throw new Error('Cannot reach the Nexora API. Is FastAPI running on port 8000?');
  }

  if (!response.ok) {
    let detail;
    try {
      const body = await response.json();
      detail = typeof body.detail === 'string' ? body.detail : undefined;
    } catch {
      // Keep a safe, generic error for non-JSON server responses.
    }
    throw new Error(detail || 'Request failed (HTTP ' + response.status + ').');
  }

  return response.json();
}

export async function listBudgets(month) {
  return request('/budgets?month=' + encodeURIComponent(month));
}

export async function createBudget(budget) {
  return request('/budgets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budget),
  });
}
