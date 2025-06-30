from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_expected_features():
    response = client.get("/expected-features")
    assert response.status_code == 200
    assert "columns" in response.json()

def test_predict_invalid_input():
    response = client.post("/predict", json={"features": [1, 2]})
    assert response.status_code == 200
    assert "error" in response.json()
