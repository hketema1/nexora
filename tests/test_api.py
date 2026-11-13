"""API tests use an isolated SQLite database, never real financial data."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.database import Base, get_db
from backend.main import app


@pytest.fixture
def client(tmp_path):
    db_engine = create_engine(
        f"sqlite:///{tmp_path / 'test.db'}",
        connect_args={"check_same_thread": False},
    )
    Base.metadata.create_all(db_engine)
    local_session = sessionmaker(bind=db_engine)

    def override_db():
        with local_session() as session:
            yield session

    app.dependency_overrides[get_db] = override_db
    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.clear()
        db_engine.dispose()


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "nexora-api"}


def test_budget_preview(client):
    result = client.post("/budgets/preview", json={
        "category": "Groceries", "limit": 300, "spent": 220
    })
    assert result.status_code == 200
    assert result.json()["remaining"] == 80
    assert result.json()["over_budget"] is False


def test_invalid_budget_preview_is_rejected(client):
    result = client.post("/budgets/preview", json={
        "category": "Groceries", "limit": -1, "spent": 20
    })
    assert result.status_code == 422


def test_create_and_retrieve_persisted_budget(client):
    payload = {"month": "2026-11", "category": "Groceries", "limit_cents": 30000}
    created = client.post("/budgets", json=payload)
    assert created.status_code == 201
    record = created.json()
    assert record["id"] > 0
    assert record["limit_cents"] == 30000
    assert client.get(f"/budgets/{record['id']}").json() == record
    assert client.get("/budgets?month=2026-11").json() == [record]
    assert client.get("/budgets?month=2026-12").json() == []


def test_duplicate_month_category_is_rejected(client):
    payload = {"month": "2026-11", "category": "Groceries", "limit_cents": 30000}
    assert client.post("/budgets", json=payload).status_code == 201
    assert client.post("/budgets", json=payload).status_code == 409
    assert len(client.get("/budgets").json()) == 1


@pytest.mark.parametrize("payload", [
    {"month": "2026-13", "category": "Groceries", "limit_cents": 30000},
    {"month": "2026-11", "category": "  ", "limit_cents": 30000},
    {"month": "2026-11", "category": "Groceries", "limit_cents": 0},
    {"month": "2026-11", "category": "Groceries", "limit_cents": 10.5},
])
def test_invalid_new_budget_is_rejected(client, payload):
    assert client.post("/budgets", json=payload).status_code == 422


def test_missing_budget_is_404(client):
    assert client.get("/budgets/999").status_code == 404
