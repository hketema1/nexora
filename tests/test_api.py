from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_health():
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json() == {'status': 'ok', 'service': 'nexora-api'}


def test_budget_preview():
    result = client.post('/budgets/preview', json={
        'category': 'Groceries', 'limit': 300, 'spent': 220
    })
    assert result.status_code == 200
    assert result.json()['remaining'] == 80
    assert result.json()['over_budget'] is False


def test_invalid_budget_is_rejected():
    result = client.post('/budgets/preview', json={
        'category': 'Groceries', 'limit': -1, 'spent': 20
    })
    assert result.status_code == 422
