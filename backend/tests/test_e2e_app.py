from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_predict_success():
    # Example with the correct number of features
    features = [5.0] * 9  # Adjust if your model needs a different count
    response = client.post("/predict", json={"features": features})
    assert response.status_code == 200
    assert "predicted_price" in response.json()

def test_docs_accessible():
    response = client.get("/docs")
    assert response.status_code == 200

def test_openapi_json():
    response = client.get("/openapi.json")
    assert response.status_code == 200
