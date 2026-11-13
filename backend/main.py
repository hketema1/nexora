"""NEXORA prototype API for the INST347 project."""

from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, ConfigDict, Field, field_validator
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from backend.database import Base, Budget, engine, get_db

MONTH_PATTERN = r"^\d{4}-(0[1-9]|1[0-2])$"


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Prototype convenience only. Use migrations before a production launch.
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="NEXORA API", version="0.2.0", lifespan=lifespan)


class BudgetPreview(BaseModel):
    category: str = Field(min_length=1)
    limit: float = Field(ge=0)
    spent: float = Field(ge=0)


class BudgetCreate(BaseModel):
    month: str = Field(pattern=MONTH_PATTERN, examples=["2026-11"])
    category: str = Field(min_length=1, max_length=80, examples=["Groceries"])
    limit_cents: int = Field(gt=0, le=1_000_000_000, examples=[30000])

    @field_validator("category")
    @classmethod
    def clean_category(cls, value: str) -> str:
        category = value.strip()
        if not category:
            raise ValueError("category must not be blank")
        return category


class BudgetRecord(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    month: str
    category: str
    limit_cents: int


@app.get("/health")
def health():
    return {"status": "ok", "service": "nexora-api"}


@app.post("/budgets/preview")
def preview_budget(budget: BudgetPreview):
    """Legacy demo calculation; does not save financial data."""
    remaining = round(budget.limit - budget.spent, 2)
    return {
        "category": budget.category,
        "limit": budget.limit,
        "spent": budget.spent,
        "remaining": remaining,
        "over_budget": remaining < 0,
    }


@app.post("/budgets", response_model=BudgetRecord, status_code=status.HTTP_201_CREATED)
def create_budget(payload: BudgetCreate, db: Session = Depends(get_db)):
    """Save a monthly budget; amounts are integer cents to avoid float rounding."""
    budget = Budget(**payload.model_dump())
    db.add(budget)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A budget for this month and category already exists",
        ) from exc
    db.refresh(budget)
    return budget


@app.get("/budgets", response_model=list[BudgetRecord])
def list_budgets(
    month: str | None = Query(default=None, pattern=MONTH_PATTERN),
    db: Session = Depends(get_db),
):
    statement = select(Budget)
    if month is not None:
        statement = statement.where(Budget.month == month)
    return list(db.scalars(statement.order_by(Budget.month.desc(), Budget.category.asc())))


@app.get("/budgets/{budget_id}", response_model=BudgetRecord)
def get_budget(budget_id: int, db: Session = Depends(get_db)):
    budget = db.get(Budget, budget_id)
    if budget is None:
        raise HTTPException(status_code=404, detail="Budget not found")
    return budget


@app.get("/", response_class=HTMLResponse)
def home():
    return "<h1>NEXORA</h1><p>Team member: Ehimhen Okojie</p>"
