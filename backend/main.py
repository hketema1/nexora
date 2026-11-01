"""NEXORA starter API for the INST347 Week 9 milestone."""
from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="NEXORA API", version="0.1.0")


class BudgetPreview(BaseModel):
    category: str = Field(min_length=1)
    limit: float = Field(ge=0)
    spent: float = Field(ge=0)


@app.get("/health")
def health():
    """Check if the API is running."""
    return {"status": "ok", "service": "nexora-api"}


@app.post("/budgets/preview")
def preview_budget(budget: BudgetPreview):
    """Demo budgeting logic only; does not save financial data."""
    remaining = round(budget.limit - budget.spent, 2)
    return {"category": budget.category, "limit": budget.limit,
            "spent": budget.spent, "remaining": remaining,
            "over_budget": remaining < 0}
