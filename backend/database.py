"""Database configuration and budget model for the NEXORA prototype.

SQLite is used locally; configure DATABASE_URL for PostgreSQL deployments.
This starter is single-user and does not yet support authentication.
"""

import os

from sqlalchemy import Integer, String, UniqueConstraint, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker


DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./db.sqlite3")
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite:") else {},
    pool_pre_ping=True,
)
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class Budget(Base):
    __tablename__ = "budgets"
    __table_args__ = (UniqueConstraint("month", "category", name="uq_budget_month_category"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    month: Mapped[str] = mapped_column(String(7), nullable=False)
    category: Mapped[str] = mapped_column(String(80), nullable=False)
    limit_cents: Mapped[int] = mapped_column(Integer, nullable=False)


def get_db():
    """Create a separate database session for each API request."""
    with SessionLocal() as session:
        yield session
