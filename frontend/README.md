# NEXORA — React budgeting dashboard (development prototype)

This screen connects to the FastAPI **persisted budget API** from PR #6. The React frontend is on a separate stacked PR; merge #6 first, then this PR. Never use personal/real financial data because authentication and account separation have not been implemented.

## Requirements

- Python FastAPI backend from the persisted-budget branch (PR #6)
- Node.js 20.19+ or Node.js 22.12+ and npm

## Start the backend (terminal 1, from repository root)

    pip install -r backend/requirements.txt
    python -m uvicorn backend.main:app --reload

Backend API docs: http://127.0.0.1:8000/docs

## Start the frontend (terminal 2, from frontend/)

    cd frontend
    npm install
    npm run dev

Browse to **http://127.0.0.1:5173**.

## Try the dashboard

1. Select the month in the upper right.
2. Choose "Groceries" and enter 300 as the amount.
3. Click "Add budget". It should appear in the list and count toward the total.
4. Refresh the browser: it should still be there because it is stored in SQLite locally.
5. Try submitting Groceries again in that same month: the API should return 409 and the frontend should show the duplicate warning.

## How it works

The Vite dev server proxies requests beginning with /api to http://127.0.0.1:8000; for example /api/budgets becomes /budgets. This avoids enabling permissive CORS for local development.

On deployed infrastructure, /api must be routed through a reverse proxy to the backend, or set VITE_API_BASE_URL at build time and explicitly configure trusted origins server-side. Do not deploy publicly without authentication, authorization, and a reviewed security model.

## Frontend checks

    npm test
    npm run build

This milestone supports creating/listing budgets and a category share breakdown. There are **no transactions, spending calculations, budget edits, deletes, bank integrations, or user logins** yet. The progress bars represent each category's percentage **of planned allocation**, not spending progress.
