# NEXORA Week 9 — FastAPI starter

Initial backend work product for INST347, not the finished app. Provides a health check and a budget calculation preview without saving user data.

## Local setup

From repository root with Python 3.10+:

```bash
python -m venv .venv
# Windows PowerShell: .venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r backend/requirements.txt
pip install pytest httpx
python -m uvicorn backend.main:app --reload
```

Open http://127.0.0.1:8000/docs. Test GET /health and POST /budgets/preview.
Example JSON: `{"category":"Groceries","limit":300,"spent":220}` returns `remaining: 80.0`.

Run tests from repository root: `python -m pytest tests/test_api.py -q`.

## Next steps
Agree on API contracts; connect PostgreSQL; add Plaid Sandbox; integrate React frontend.
Never commit keys or .env files.
