# NEXORA — Persisted budget prototype (FastAPI)

This iteration adds saved monthly budgets to the Week 9 FastAPI starter. It is a **single-user development prototype**. There is **no login, user isolation, or production migration system** yet. Do not upload real bank data or deploy publicly.

## Run locally (Python 3.10+)

From the repository root:

    python -m venv .venv
    # macOS/Linux:
    source .venv/bin/activate
    # Windows PowerShell: .venv\Scripts\Activate.ps1
    pip install -r backend/requirements.txt
    python -m uvicorn backend.main:app --reload

Open http://127.0.0.1:8000/docs to exercise endpoints. The default database is a local **db.sqlite3** SQLite file; it is ignored by Git.

## Create a monthly budget

POST /budgets (JSON body):

    {"month":"2026-11","category":"Groceries","limit_cents":30000}

A limit_cents value of 30000 means **$300.00**. The response has a generated id. Repeating the same month and category returns **409 Conflict**. GET /budgets?month=2026-11 lists that month's saved budgets; GET /budgets/{id} retrieves one budget. POST /budgets/preview remains available and does not save data.

## Run tests

    pip install pytest httpx
    python -m pytest tests -q

Tests use their own temporary SQLite database and never touch personal financial data.

## PostgreSQL option (for later Azure development)

Set DATABASE_URL in your local environment to a valid SQLAlchemy connection string such as:

    postgresql+psycopg://USER:PASSWORD@HOST:5432/DATABASE

Use an encrypted connection when connecting to Azure. Never commit credentials or .env files. PostgreSQL schema migrations, authentication, transactions, Plaid, and React integration are **next steps**, not included in this PR.
